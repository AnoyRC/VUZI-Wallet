//SPDX-License-Identifier: MIT
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

contract RecoveryVerifier {
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
        vk.alpha = Pairing.G1Point(uint256(0x214e94235eb337777de0c4549a53613b7f615df65de2b3f3eef469a1a2bc0a8c), uint256(0x0bb1334be0b9c6a30215c3a82290461d7745467b4724922c0b2b9d25a79983fa));
        vk.beta = Pairing.G2Point([uint256(0x297be4d0c3b1e4a1131193bb31445c6116273739c080b61d627c784235610b9a), uint256(0x26dec9e7ebc166858c4a4145ed84830a5ed8b339d033aa332adea0316c6d0493)], [uint256(0x0f9691270374637248b3bf9c15d8cce40406a5695fcf23bb282b8f8f7e87cd98), uint256(0x1e122a0a3b48e1c077a1b5376316ffe290f880eef299ba0a570f401b9e92655d)]);
        vk.gamma = Pairing.G2Point([uint256(0x00b9967916c5dbeeb27e234d0490d482334c56281d4189fc189c7eb9a1347c82), uint256(0x1da03f24e1635aa9146cae0643258888333369e46e953e4dea4af0694402cd15)], [uint256(0x035feb04d739b1c5144c7b040bcc967c3ba4b566231928aeacc3ee73c97d0c0c), uint256(0x2d30115725fb64c6acc0989734a1dc667f37ca231fa8149fcdba7a325a5737c1)]);
        vk.delta = Pairing.G2Point([uint256(0x283c3c35763d051fa6c840926277bce13e2d06b6d39d044dce2bad34c86ac17c), uint256(0x047bc4d97aa0e45a329036ecd17a263a351c5d0845d643f09590ec2e67c8d066)], [uint256(0x0773ff37659e8e884fe7f8dc3627887ff5a1a365cbbdbb240ff50b8ee8b49daa), uint256(0x04ceff8ab1d9f9ad56b3fa1cd0ffbaf1fa21a32179e9aea4c92efd96a2034042)]);
        vk.gamma_abc = new Pairing.G1Point[](7);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x03b648784d608d3596e23b2167a054637d5bd491ba1a4df3c1219a52a71fd7ac), uint256(0x23256277ff1f99fa681a231291852300ca316b92b8f0f2bd35b60ab93d05ca77));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x0b22c5e303930583c5e56acc8d670ab01b329c3657d3429be4646128d8ecb819), uint256(0x1db1194c8c2495c5991b8ac91e2c79bbdf6bcd0d2834e5baa68cd923b87d3f21));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x021342a151d75d36be2db6c3573dcb8375322e004a961ef83a75d5dc89367224), uint256(0x2b675a81aa5f0f1c4d47a6c2b4e313c942e8645125a4d17814cf3d90e4e8def2));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x0bb3634d97697e7a2246b44931032bbae5a58808295cb4da605aa4ca221fff00), uint256(0x1980e77bd6e8295c65d6a76829ed9337d30b2f963ee23c80a8d9def16f18c3de));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x0ea9338bd565f226e286e3d7410245d71b2d194a2f75bc324bfeb5be6eea9743), uint256(0x1160143ff81786be96a39ce928687b4208e2afcd930209d00bb3da34518d1a7e));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x06c1ed5ce0d556a48148cf1c0f3c0e218940aa40a50094fdad260198f5d1cf48), uint256(0x219e91aa93efc56c528f62681e3c740448cd3d3af1f5cfa264ff59358dc1a317));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x27776a563a58733a0c147c74488c431d08fcea03aa3a0e994d3a5a7c8a9007a7), uint256(0x29e5d8d4c820071ae680183c73158b159a1da89381f92e5e6a214b9d7723a9be));
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
    function recoveryVerifyTx(
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
