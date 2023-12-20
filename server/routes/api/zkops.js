const express = require("express");
const router = express.Router();
require("dotenv").config();
const fs = require("fs");

const getUintEncodedString = (plainString) => {
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(plainString);

  const numericU32Array = [];
  uint8Array.forEach((element) => {
    numericU32Array.push(element.toString());
  });

  return numericU32Array;
};

async function generatePasswordHash(passwordArray) {
  try {
    let { initialize } = await import("zokrates-js");
    const zokratesProvider = await initialize();

    const source = `import "hashes/sha256/256bitPadded" as sha256;
          import "utils/pack/u32/pack128" as pack128;
          
          def main(private u32[8] a) -> field[2] {
              u32[8] h = sha256(a);
              return [pack128(h[0..4]), pack128(h[4..8])];
          }`;

    const artifacts = zokratesProvider.compile(source);

    const { witness, output } = zokratesProvider.computeWitness(artifacts, [
      passwordArray,
    ]);
    const lineBreakCleanedOutput = output.split("\n");
    const cleanedArray = [...lineBreakCleanedOutput.slice(1, 3)].map((item) => {
      return item.trim().replace(/^"|"|,$/g, "");
    });

    return cleanedArray;
  } catch (error) {
    throw new Error(error);
  }
}

router.post("/passcode/hash", async (req, res) => {
  try {
    const password = req.body.password;

    if (!password) {
      return res.status(400).json({ error: "Bad Request" });
    }

    const passwordHashUint8Array = getUintEncodedString(password);
    const passwordHash = await generatePasswordHash(passwordHashUint8Array);

    res.json({ passwordHash });
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.post("/passcode/verify", async (req, res) => {
  const password = req.body.password;
  const passwordHashes = req.body.passwordHashes;
  const nonce = req.body.nonce;

  if (!password || !passwordHashes || !nonce) {
    return res.status(400).json({ error: "Bad Request" });
  }

  try {
    let { initialize } = await import("zokrates-js");
    const zokratesProvider = await initialize();

    const source = `import "hashes/sha256/256bitPadded" as sha256;
      import "utils/pack/u32/pack128" as pack128;
      import "utils/casts/u32_to_field" as u32_to_field;
      
      def main(private u32[8] password, private field uncheckedNonce, field[2] hashedPassword, u32 nonce) -> bool {
          u32[8] h = sha256(password);
          field[2] res = [pack128(h[0..4]), pack128(h[4..8])];
      
          assert(hashedPassword[0] == res[0]);
          assert(hashedPassword[1] == res[1]);
          assert(u32_to_field(nonce) == uncheckedNonce);
      
          return true;
      }`;

    // compilation
    const artifacts = zokratesProvider.compile(source);
    const passwordHashUint8Array = getUintEncodedString(password);

    const { witness, output } = zokratesProvider.computeWitness(artifacts, [
      passwordHashUint8Array,
      nonce.toString(),
      passwordHashes,
      nonce.toString(),
    ]);

    const provingKeyData = await fs.readFileSync(
      `${__dirname}/../../constants/passcode/proving.key`
    );

    const provingKey = new Uint8Array(provingKeyData);
    // generate proof
    const proof = zokratesProvider.generateProof(
      artifacts.program,
      witness,
      provingKey
    );

    const transposedProof = [proof.proof.a, proof.proof.b, proof.proof.c];
    res.json({ proof: transposedProof, inputs: proof.inputs });
  } catch (err) {
    console.log(err);
    res.json({ err: err.message });
  }
});

module.exports = router;
