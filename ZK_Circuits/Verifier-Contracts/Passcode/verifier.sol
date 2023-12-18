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
        vk.alpha = Pairing.G1Point(uint256(0x20ff06a9228f7b7cfcdac65d1f42a5d894217f55f7965dea3e7453a6f734101e), uint256(0x1ba02a2b072ae833c850e07f950fbd6a55b3ff059df17a57c8c425995eb42359));
        vk.beta = Pairing.G2Point([uint256(0x132b1428a2227c43d071b196b061e7c9c49a7aa856e799cfbb5b586247fcab9c), uint256(0x18c7023b2eb6137626b6757d548483bf118a96cca60be7667bc47f6e3b5888f5)], [uint256(0x2c8c52a82b72d6926414db20d9881ee2336c193639990f6f8356c7868198b692), uint256(0x06989e80120e7d4aa892014b1cda3f96cc202e8723dfbad33a86902167cd9641)]);
        vk.gamma = Pairing.G2Point([uint256(0x245a44ba43f01b406e1536b1e5d1f67f1416d9b0f275a5fb7d884a4e81083a53), uint256(0x14cce0a60a71eac41b4f96c3b00cf6c69ef2ae25d6b4ca0ed5a8d4adb3905865)], [uint256(0x22564b6218adda5d4031f669f734d7dd1a738a488a60981d2568d1e0054d1ca3), uint256(0x29d36ff4847bd603eb17d8635043453bbeef9c5ab3921c78d6f52641369d959c)]);
        vk.delta = Pairing.G2Point([uint256(0x10868433f481f4ae88ef5a88fd5348a0931a383cd854a71e1d8bcf4d3601ccbe), uint256(0x24adce2a6cfe9348d1873e76fcbd9f1e8450dda1f9c76fd17876a9f60b01f23f)], [uint256(0x19e3ac537c724010fc4848bd064ed24fcc1176806a4fc3ec1d576100fb672606), uint256(0x2cc44714810b50153d877b413f7855c8c19cdfe7be193824d02f3de7ef7cc192)]);
        vk.gamma_abc = new Pairing.G1Point[](10);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x19a8761700146a43430107171bdc67e5c9849710b7aed7e16cd9bfc0128be504), uint256(0x2287340175cf547e71393f04a69697dbb108d26da782cf0f861def42c472042a));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x2b54796224640ac51c768125c866be2abc6d6458e56a431b43cbf8b55813daaf), uint256(0x0e7fc02d994b6b978f0d74c300db0538f9863f73b011ee414be4de548661e200));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x19ec4474563809a1febb6146cf5ee2f2f2b22aefb16d67616a18738f20d0c35b), uint256(0x0e8b3c192869f130d383887baaf4103ffe57c9628ce619fc36ef89fe6791c208));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x103e8850e427e0dc7e984b945eb2a68efa3d03c46deac93c8393a23d0a774bbc), uint256(0x0370bf43f7211c06bfe8f128eb82b98c09053284ae3ae618853c2885e3666551));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x1f5ac48aaa19fadfebb03419d25730e7a0401411c643c8cbe8093a4451ac6535), uint256(0x27b3761d992fddf03ff24ccd459e00c89f0af250736ce154071c13ecc45710c9));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x2dfdb30bf5db420d31c23bf480ce641c24a897f804a88083f51a5e652df55638), uint256(0x06546ba7af0c9668d43cfbcb61ba1f7d77f7fb8e54e60509ba97cdf6ede41e0d));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x0868d72d1c13a7fbdd2c17150f3014c3229e03a7957e9ae3ca22094ae4f87a89), uint256(0x23581e7efe4765c1e384b2b2ffc0cd662c343ec3399a2e1ef7c7ddb6a73d710a));
        vk.gamma_abc[7] = Pairing.G1Point(uint256(0x22082b2962796321bdbb4611e11bac6643bc8732837615931a2006eb814b172b), uint256(0x08067695026d7ae631ccc35381643ebcc54a31f923e80870625b2e59cedb7141));
        vk.gamma_abc[8] = Pairing.G1Point(uint256(0x1180fb8f3999f0eb0f75917593a42f71dadee9f692757e119589c5ab47bbb714), uint256(0x27b5e2b74c016d315bbd6178d0308b49e3c4137c60119d7dda672a9fd81fcf03));
        vk.gamma_abc[9] = Pairing.G1Point(uint256(0x1a56a173f2ec7e59c72464f803b16b3ef8a6dfc2fe3403b6590d13b6aaf2db36), uint256(0x0e04baea64012852bac0aa7a998314770e3e977dd21cddb52b34bb51b58ebfea));
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
            Proof memory proof, uint[9] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](9);
        
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
