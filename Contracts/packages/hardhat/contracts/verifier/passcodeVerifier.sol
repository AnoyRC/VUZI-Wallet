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
    function passcodevVerifyingKey() pure internal returns (PasscodeVerifyingKey memory vk) {
        vk.alpha = PasscodePairing.PasscodeG1Point(uint256(0x1c3200e60e948cc8e5d9649df17f0594908c1ca59e3e02bd5bc48a0f81073135), uint256(0x17ff3b30e17b91957361060a5c83e46809d56953eea520e03968396950477fd9));
        vk.beta = PasscodePairing.PasscodeG2Point([uint256(0x2da3ceb23ac46f36c973b1b7fd7513f55241e9cda98e4088adc72d69dc062be6), uint256(0x26f06246e149fc744841d93f500b23e66614e09323958b668ed88bbc754c545a)], [uint256(0x2a70a27d84db32bda401f21bee83b565069351a38334267371d4f9db1e3dac43), uint256(0x0e5f64b934157a3d110f45b714c32614e1cf078bd0ba9142fa00294fce169351)]);
        vk.gamma = PasscodePairing.PasscodeG2Point([uint256(0x2062649dd9311cc838fe395f2a846cc207ab32ff3bb0a837eac889aa1d964476), uint256(0x15bde96dd8efa6cfeb8d49d1854ee370f662768f8a3a36d535c6638a7665014f)], [uint256(0x25ea408149742d30ee3e61d0335fb0f081a4e68ada023fc52ecf185fc97a61f4), uint256(0x28c2752a227294d4b821a9a7bb90c61cf348756d7d181a6fbf6b6cbc1f836583)]);
        vk.delta = PasscodePairing.PasscodeG2Point([uint256(0x26f303e22912117b253e09eb0a3ddf9c8401b8d5edffba3d8f2aab444610c208), uint256(0x140d61984537ab658b59407c68ad9024fbfb5b24535766a942ac7c9b55f35f3c)], [uint256(0x05a4fcb6eb581756ffcc95f0767b53c1a8788b4560f58235566daca437188dfc), uint256(0x11c949aa8711aa6403fd507b562cdb0ba52ff99b16c111c58763e6dc18c36e4b)]);
        vk.gamma_abc = new PasscodePairing.PasscodeG1Point[](4);
        vk.gamma_abc[0] = PasscodePairing.PasscodeG1Point(uint256(0x0808459bed58b49fd902487fe842109fa52e44d4f45a1d10236c54560f0a8918), uint256(0x1e5d3f8f5231771f13581e6677626074896e6d2433d94ca54c56d9632d66ed2b));
        vk.gamma_abc[1] = PasscodePairing.PasscodeG1Point(uint256(0x1b3a3230d7bacb41ddba73371b7f58d67560c5b1f23f9db82b69b988fa3a7ef5), uint256(0x1c0c9d0c88918749135e08a3a8186b345e0c34046223564e0d213f78ef5d425d));
        vk.gamma_abc[2] = PasscodePairing.PasscodeG1Point(uint256(0x03b61e19ebbc3ff00c77e6d3065dc356f4efb18d389a3b750151e20beda0dcb3), uint256(0x280c9c4c75b95328aa1f7886e0d48b6acb8eb54b01e1f22795878d83a1c60936));
        vk.gamma_abc[3] = PasscodePairing.PasscodeG1Point(uint256(0x2090b4b80c17d7eabfcea38bcb3fe2d622127c2fbe557ef200928bcbdaea6396), uint256(0x104c84338397e43a3554990dcac620b5f90cf251affbd8607d1a9c236254cae1));
    }
    function passcodeVerify(uint[] memory input, PasscodeProof memory proof) internal view returns (uint) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        PasscodeVerifyingKey memory vk = passcodevVerifyingKey();
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
            PasscodeProof memory proof, uint[3] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](3);
        
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
