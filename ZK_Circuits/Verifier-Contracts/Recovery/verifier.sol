// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
pragma solidity ^0.8.0;
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() pure internal returns (G1Point memory) {
        return G1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() pure internal returns (G2Point memory) {
        return G2Point(
            [10857046999023057135944570762232829481370756359578518086990519993285655852781,
             11559732032986387107991004021392285783925812861821192530917403151452391805634],
            [8495653923123431417604973247489272438418190587263600148770280649306958101930,
             4082367875863433681332203403145435568316851327593401208105741076214120093531]
        );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) pure internal returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    /// @return r the sum of two points of G1
    function addition(G1Point memory p1, G1Point memory p2) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
    }


    /// @return r the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point memory p, uint s) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require (success);
    }
    /// @return the result of computing the pairing check
    /// e(p1[0], p2[0]) *  .... * e(p1[n], p2[n]) == 1
    /// For example pairing([P1(), P1().negate()], [P2(), P2()]) should
    /// return true.
    function pairing(G1Point[] memory p1, G2Point[] memory p2) internal view returns (bool) {
        require(p1.length == p2.length);
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++)
        {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[1];
            input[i * 6 + 3] = p2[i].X[0];
            input[i * 6 + 4] = p2[i].Y[1];
            input[i * 6 + 5] = p2[i].Y[0];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
            // Use "invalid" to make gas estimation work
            switch success case 0 { invalid() }
        }
        require(success);
        return out[0] != 0;
    }
    /// Convenience method for a pairing check for two pairs.
    function pairingProd2(G1Point memory a1, G2Point memory a2, G1Point memory b1, G2Point memory b2) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](2);
        G2Point[] memory p2 = new G2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](3);
        G2Point[] memory p2 = new G2Point[](3);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for four pairs.
    function pairingProd4(
            G1Point memory a1, G2Point memory a2,
            G1Point memory b1, G2Point memory b2,
            G1Point memory c1, G2Point memory c2,
            G1Point memory d1, G2Point memory d2
    ) internal view returns (bool) {
        G1Point[] memory p1 = new G1Point[](4);
        G2Point[] memory p2 = new G2Point[](4);
        p1[0] = a1;
        p1[1] = b1;
        p1[2] = c1;
        p1[3] = d1;
        p2[0] = a2;
        p2[1] = b2;
        p2[2] = c2;
        p2[3] = d2;
        return pairing(p1, p2);
    }
}

contract Verifier {
    using Pairing for *;
    struct VerifyingKey {
        Pairing.G1Point alpha;
        Pairing.G2Point beta;
        Pairing.G2Point gamma;
        Pairing.G2Point delta;
        Pairing.G1Point[] gamma_abc;
    }
    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }
    function verifyingKey() pure internal returns (VerifyingKey memory vk) {
        vk.alpha = Pairing.G1Point(uint256(0x223b09ac5ee4c6bff92ff7f75510efd126783052dbc6bd645db74eb055980d0e), uint256(0x22702f540cbfe8562ee0185369da66a2b65723f5266119204eb1acd387444dff));
        vk.beta = Pairing.G2Point([uint256(0x2aedcae2e7cd6c8fd56d9c7c338e8dbf8b79e307c813a2cecf343fbf14c8752b), uint256(0x0a34642306472da5a952ea12b3d949250e4852c89b073ad2e52b53959bba1ca2)], [uint256(0x106312cfaa72a4473349e674a088904d12e7174d5ba4c49a7c4dbf41b3e122b0), uint256(0x2a5beb5daf18e38f6078ee6ed21be511a4762b10b8118353c0761e3131957fbb)]);
        vk.gamma = Pairing.G2Point([uint256(0x1cdef527a843b07f568ed574babb40cbb6e1f5f457c0b37a6b9e71e311dfe8cd), uint256(0x0e5baa097dffaf76d59ce98e8419459b562ea72501e24837cd6aec5279da6a42)], [uint256(0x22ae358fff271f549a04c8965c66ad2259ca88832651a876ca72acee58003613), uint256(0x13752ae0dd611dccc734f4ae948ee2fa100a394b8701682a07303f628843fa2f)]);
        vk.delta = Pairing.G2Point([uint256(0x2f1573f625fcaac859042a14c56ad9e31ce17224daf0f2c8f6eb41551117e0de), uint256(0x1a5072c6b2760030a1e48ec4be1a73b90c6dbb99f0264e492ebfe2ef8b868654)], [uint256(0x00e4b15faaa0d7aeee8dca4cd21bf5b3afea5ce93dced9db1814af03e55ce5bc), uint256(0x003293e91a0fc6299193e3e6fb38cd43b68ca7008cca53a601fe846a2db297b6)]);
        vk.gamma_abc = new Pairing.G1Point[](7);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x022d47319faf07959dc86a49c269c13b2e7ecc2b0736121a653482c074d88244), uint256(0x28cb73e3f0b0729688e03fbf49cb6a2effd619993d6fee72dc2eda26d3178aba));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x24576e8eb6687c0dd86b4e3352e3001ff0b0da2e48cf068aef78230a8831b604), uint256(0x053d9e77ff445d59cf9bbbd314207b11e3d9c0c1305097e443f6592075ed14a1));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x0fbade4eaba0b1809e72dd753c56c7cb644fe2a8732fb1b454670ce8423a6f12), uint256(0x063315075997e69cea49200fae58be9e33b12ea723f9bde8ad7af8be5e59d360));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x186c633df276a6885061f932211f46794174df4f59635b000df9858b5c753117), uint256(0x2d8639f797035a97c26867dca37ff1043e999a7cc0087266f919bb54946215d1));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x210bdb110905d6357354045e2d391ffdae13ed33533a39b595283dbf28d75d8a), uint256(0x1b9e99618842a560974603b0f453a68da2a268257fa87103ca687f12e32f1c74));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x0df78329bd8054b98e5ad7e7b8e9f2800b72946602a4a2d7a68ea23fc1312ebe), uint256(0x10575dc5b1436ef95ce25de0e2da800ed2b1c03c841d5bedf2c15f4b18b01a53));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x05cb1872ba486fbbdc4fe2466e6f281b1ba1cd5558a379b58067788d222f5962), uint256(0x140dc3cf988a5f77c7755f7b4df8591c8b22e4f43ba17c85a2d6e305514c6bfe));
    }
    function verify(uint[] memory input, Proof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.gamma_abc.length);
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.gamma_abc[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.gamma_abc[0]);
        if(!Pairing.pairingProd4(
             proof.a, proof.b,
             Pairing.negate(vk_x), vk.gamma,
             Pairing.negate(proof.c), vk.delta,
             Pairing.negate(vk.alpha), vk.beta)) return 1;
        return 0;
    }
    function verifyTx(
            Proof memory proof, uint[6] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](6);
        
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (verify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}
