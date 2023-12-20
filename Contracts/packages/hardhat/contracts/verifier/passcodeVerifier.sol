//SPDX-License-Identifier: MIT
// This file is MIT Licensed.
//
// Copyright 2017 Christian Reitwiessner
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
pragma solidity ^0.8.0;
library PasscodePairing {
    struct PasscodeG1Point {
        uint X;
        uint Y;
    }
    // Encoding of field elements is: X[0] * z + X[1]
    struct PasscodeG2Point {
        uint[2] X;
        uint[2] Y;
    }
    /// @return the generator of G1
    function P1() pure internal returns (PasscodeG1Point memory) {
        return PasscodeG1Point(1, 2);
    }
    /// @return the generator of G2
    function P2() pure internal returns (PasscodeG2Point memory) {
        return PasscodeG2Point(
            [10857046999023057135944570762232829481370756359578518086990519993285655852781,
             11559732032986387107991004021392285783925812861821192530917403151452391805634],
            [8495653923123431417604973247489272438418190587263600148770280649306958101930,
             4082367875863433681332203403145435568316851327593401208105741076214120093531]
        );
    }
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(PasscodeG1Point memory p) pure internal returns (PasscodeG1Point memory) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return PasscodeG1Point(0, 0);
        return PasscodeG1Point(p.X, q - (p.Y % q));
    }
    /// @return r the sum of two points of G1
    function addition(PasscodeG1Point memory p1, PasscodeG1Point memory p2) internal view returns (PasscodeG1Point memory r) {
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
    function scalar_mul(PasscodeG1Point memory p, uint s) internal view returns (PasscodeG1Point memory r) {
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
    function pairing(PasscodeG1Point[] memory p1, PasscodeG2Point[] memory p2) internal view returns (bool) {
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
    function pairingProd2(PasscodeG1Point memory a1, PasscodeG2Point memory a2, PasscodeG1Point memory b1, PasscodeG2Point memory b2) internal view returns (bool) {
        PasscodeG1Point[] memory p1 = new PasscodeG1Point[](2);
        PasscodeG2Point[] memory p2 = new PasscodeG2Point[](2);
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }
    /// Convenience method for a pairing check for three pairs.
    function pairingProd3(
            PasscodeG1Point memory a1, PasscodeG2Point memory a2,
            PasscodeG1Point memory b1, PasscodeG2Point memory b2,
            PasscodeG1Point memory c1, PasscodeG2Point memory c2
    ) internal view returns (bool) {
        PasscodeG1Point[] memory p1 = new PasscodeG1Point[](3);
        PasscodeG2Point[] memory p2 = new PasscodeG2Point[](3);
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
            PasscodeG1Point memory a1, PasscodeG2Point memory a2,
            PasscodeG1Point memory b1, PasscodeG2Point memory b2,
            PasscodeG1Point memory c1, PasscodeG2Point memory c2,
            PasscodeG1Point memory d1, PasscodeG2Point memory d2
    ) internal view returns (bool) {
        PasscodeG1Point[] memory p1 = new PasscodeG1Point[](4);
        PasscodeG2Point[] memory p2 = new PasscodeG2Point[](4);
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

contract PasscodeVerifier {
    using PasscodePairing for *;
    struct PasscodeVerifyingKey {
        PasscodePairing.PasscodeG1Point alpha;
        PasscodePairing.PasscodeG2Point beta;
        PasscodePairing.PasscodeG2Point gamma;
        PasscodePairing.PasscodeG2Point delta;
        PasscodePairing.PasscodeG1Point[] gamma_abc;
    }
    struct PasscodeProof {
        PasscodePairing.PasscodeG1Point a;
        PasscodePairing.PasscodeG2Point b;
        PasscodePairing.PasscodeG1Point c;
    }
    function passcodeVerifyingKey() pure internal returns (PasscodeVerifyingKey memory vk) {
        vk.alpha = PasscodePairing.PasscodeG1Point(uint256(0x23e367a548451ba8f0776ea34cb2e183e7ff6c6988682010803584fe97989de3), uint256(0x1db88115b766571ac0fd02d94e2b094513ed1e95f13c9f590adfa8903e2e49c9));
        vk.beta = PasscodePairing.PasscodeG2Point([uint256(0x10c45a5d74ae9fb066b782e017ea188faa796b66bd5aabc9b72e70559b6e2da0), uint256(0x304ba133aac92d0a41e8fa67c88eb43c5bfc86e41a8649178921796159ac5f84)], [uint256(0x0e76ba8b4dc01306f5a429c3c1f66c70caee2deb3dd0ed5a7313155de61a91a2), uint256(0x094c4feae519402514e58f74800aeb505781c6c9cf0135a0dba601925a983d2a)]);
        vk.gamma = PasscodePairing.PasscodeG2Point([uint256(0x1901b0ee81098c43755ebca7d09263ad84b82cf5e5fe2bafc61c9032fe5a130f), uint256(0x2ec2839e502d1e2529158c752236d0586ce07f74d6abed7f9bff5919fc7564f0)], [uint256(0x22d4891f7a1ce4231b029fd6aa673cfdd37ff46700686ad7db8f9d542f8ba24a), uint256(0x27a46f9c4f6ad2f5939a4cbabf57ab1a1c0ae5d30f7441da9e642c2871bc6f99)]);
        vk.delta = PasscodePairing.PasscodeG2Point([uint256(0x0b9732681b130fa2ca6cab03766934f4a2d2befa1e70a0e97f0a03222dc72140), uint256(0x06617b5957fdebf76b0ec13b0d7dbcefe71d6d107cbf49b27fd96f2e44d77306)], [uint256(0x2a188219deeaea1ecc3b4b27b26dfc4e0b6d426c440f0f5c31c24a10a094c796), uint256(0x14cd79c232c7c97a01e88ea2519f36f97655c706523fa1465a02764d0b772348)]);
        vk.gamma_abc = new PasscodePairing.PasscodeG1Point[](5);
        vk.gamma_abc[0] = PasscodePairing.PasscodeG1Point(uint256(0x2585c36cb0a0257f94d3489a8e6047f90a5f25ed8ba1751faf735dad6fbec603), uint256(0x17f6e54b6ca89c931a38ebdacd414f9079ef9c56a6e23dd4449d4475a33e0f34));
        vk.gamma_abc[1] = PasscodePairing.PasscodeG1Point(uint256(0x06a7bc23475b40925e13d75acaaec5f57c5791022beb7f6ae14deeaa0eb6ce41), uint256(0x137aff9ae040636e1b517f43a0518df99498a1805388e61fad51b3afed62e62a));
        vk.gamma_abc[2] = PasscodePairing.PasscodeG1Point(uint256(0x00411e26ef0b555702ed65c6bd325b9e8058623c14d537a077e46e30a04e4ad6), uint256(0x2983114d5602441f7e0bdca4a9bea03229d492b251cdcab11f899b736470b502));
        vk.gamma_abc[3] = PasscodePairing.PasscodeG1Point(uint256(0x0ab7795a11fd6ac2a50f54f8a0e5e74641e77492142dc247bf6b743757ccd362), uint256(0x2ffcff97802bf7fd38b116c23847d02fed77fd7123402f2bb65134c09bf4aa93));
        vk.gamma_abc[4] = PasscodePairing.PasscodeG1Point(uint256(0x2a5961a64c9a0ccc1e545121e6fb7c1bce5ef2192ef87ecf4dec455366650896), uint256(0x1a44d49c2f30e3f24eee73bb7b0551888fa9a48747fc10fdf44a9d5a9a4bc12e));
    }
    function passcodeVerify(uint[] memory input, PasscodeProof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        PasscodeVerifyingKey memory vk = passcodeVerifyingKey();
        require(input.length + 1 == vk.gamma_abc.length);
        // Compute the linear combination vk_x
        PasscodePairing.PasscodeG1Point memory vk_x = PasscodePairing.PasscodeG1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = PasscodePairing.addition(vk_x, PasscodePairing.scalar_mul(vk.gamma_abc[i + 1], input[i]));
        }
        vk_x = PasscodePairing.addition(vk_x, vk.gamma_abc[0]);
        if(!PasscodePairing.pairingProd4(
             proof.a, proof.b,
             PasscodePairing.negate(vk_x), vk.gamma,
             PasscodePairing.negate(proof.c), vk.delta,
             PasscodePairing.negate(vk.alpha), vk.beta)) return 1;
        return 0;
    }
    function passcodeVerifyTx(
            PasscodeProof memory proof, uint[4] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](4);
        
        for(uint i = 0; i < input.length; i++){
            inputValues[i] = input[i];
        }
        if (passcodeVerify(inputValues, proof) == 0) {
            return true;
        } else {
            return false;
        }
    }
}
