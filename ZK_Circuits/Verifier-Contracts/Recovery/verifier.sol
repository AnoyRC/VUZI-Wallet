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
        vk.alpha = Pairing.G1Point(uint256(0x0bba8f104324d310c14ad2b5a01e9ed0f1831bfdcdca5c8ebbe345351476c86b), uint256(0x24584c9aceda2d47ffd3771ac5f2ddf219350cbc27f713e02593fe3ecca54f56));
        vk.beta = Pairing.G2Point([uint256(0x1fb4968cd45baddf23a629686d6a08ddf8b572adfd52e39f1fe24adb59040fc8), uint256(0x1c4a870931c16b8e2d49a01f1402d8780e1e7ff6526c12201e2597235dc4165c)], [uint256(0x0ff578101b41bbfede6fb5581a6363bafd9fc9a09c5b861e1015e7ab0a9c05b1), uint256(0x0bb812291d49b586c4e98c7279fe35c0a82483dd44abec5f3733e002c0c36daa)]);
        vk.gamma = Pairing.G2Point([uint256(0x1605e93cdf41e762c5921ac2a99d382117f235adfc5f41e74151438a7cdc6dc2), uint256(0x117d288d5ca13a455f7056b006ed21c54acfb234634ffb5f4c3db5779f1572f3)], [uint256(0x115048dde52c0adf720a282c02c29cfd55fa2854ca5577bffd9e547a92829f36), uint256(0x0a61fcc9d2a76254d92c37dfb2a38636a4f72248ca5796fab22d9a7eafa89571)]);
        vk.delta = Pairing.G2Point([uint256(0x00579bd7ce8464ce9c8042dc8a705903aeaca9fba40a579e31e2269e9110c3c6), uint256(0x139acda04d593e22d8170a10e581a498e64070e26b53263e7d95c382f621fffd)], [uint256(0x1c39a18777d661c02da1e7796bbb4b3b4f314d083535c1bef1b3b5c580eebeda), uint256(0x1ed6d801350892add589e5d6ab2eb564888a300724f787813d05a1be33a5fdea)]);
        vk.gamma_abc = new Pairing.G1Point[](34);
        vk.gamma_abc[0] = Pairing.G1Point(uint256(0x008da024e7c25883f90f548ab9ce5a29752f4b660593f47531d23ef95c61c3d7), uint256(0x0fa3ac939932d86bb8e5ba6e17ad0fab7c40636daafe13fe3309eda58004dd49));
        vk.gamma_abc[1] = Pairing.G1Point(uint256(0x1ee3657c4e9e5a16b7a32911d19ec78b5025dfa04e125ea9f5c15d0154399666), uint256(0x283d0f43f9025d533862950b1a5977bb1df8967cf00f438a047d5d2da00526da));
        vk.gamma_abc[2] = Pairing.G1Point(uint256(0x0f77c1db1b323277861d7e221f1d03d6a6fc1b97880adcc861ea064194e63f89), uint256(0x0c3bdd790ed9f0c11b52a4e71ff9799270219bd87a07372492e83490e94694a6));
        vk.gamma_abc[3] = Pairing.G1Point(uint256(0x2791b12df753b435da24367b0863cbf1748b15af749cef55e987dfa2cc7f2cb3), uint256(0x20d59ea048b2795cc32b937dd3a95a0a7a759bfde9c336c393510d22fe9caf39));
        vk.gamma_abc[4] = Pairing.G1Point(uint256(0x0e80cfac45940e5fdcff43df7a5605021c6878e5dc1e1854425a139731b2043d), uint256(0x16957b00a814292d0efb0e32bdfaf6bfc6764cac781e692e1d116a1e2c2905ad));
        vk.gamma_abc[5] = Pairing.G1Point(uint256(0x0aa253bca910723eb84e7e544442f2159b42cc76f1d5917f10a2d9efc7549163), uint256(0x28381fc36f8bd7d841e4aed37a87dacbbb80846452103e38450c0308390a66dd));
        vk.gamma_abc[6] = Pairing.G1Point(uint256(0x0a798cd27eb828c2050c5e43391d9aefd915aa8d30be99b620da99e5fb908a4c), uint256(0x12dbfde789e828346301d8c8394366380ba71f5259365aa04935ffa30002e749));
        vk.gamma_abc[7] = Pairing.G1Point(uint256(0x1feb4c1bb0f50f26844b812090ea0db4ce647de02789cb79b6e481dcd1566f43), uint256(0x23c6425e604c0db6cc54ddf0cbc4590a1b4d078539c73636cd9963203e9aef6d));
        vk.gamma_abc[8] = Pairing.G1Point(uint256(0x1a3ed4fedb0be3891a109546e7b0f7c41fabf1e66c42bd0180a9f209191fcdf5), uint256(0x263125ffe4a49a0dd0f89fc346dcb8ff3819660718e321062b6f175dcc50e8df));
        vk.gamma_abc[9] = Pairing.G1Point(uint256(0x0654d678026c39ac4f2fc6c8d391040c5ce348885c0ef256e50f878032154de9), uint256(0x11ce8699685d2ca530ff8b391d4d8b7004069c09baa9ff10fe4ce8cbba7dc555));
        vk.gamma_abc[10] = Pairing.G1Point(uint256(0x02ee7a3b1aa4f26f8ae316244d3803bf6e663b84b608c049e2d66e07dfd19407), uint256(0x1015ae72d4f9961c05fddccc376cee76110019a89239933f8344a9117ab6243b));
        vk.gamma_abc[11] = Pairing.G1Point(uint256(0x063378f11ff9a6d4f4c667acf4bcc16443b0285888072cee7bd4e2b155f7c4e4), uint256(0x0a8d156c6d2304a9470f8c85b4ec04439977b5fd9e34e3f3f5e266ed9bd22c0e));
        vk.gamma_abc[12] = Pairing.G1Point(uint256(0x1a62a6c0681f57fbac6e788a2c0b3be6eb16eebdfdbce9424506b8dc98bb8152), uint256(0x22609ff2589cfb32e8447ceca9fa53a6591cb3c5723085f041a203daa075cd8e));
        vk.gamma_abc[13] = Pairing.G1Point(uint256(0x0327283e2fc7ffff0e487b66fb7ea032e4ed10c0ca97a3d0deab9ba89bc0288c), uint256(0x1ef181fbbcb24cf9d62694f1700989657185e6ca9bbd90b15ff655aefa1743fb));
        vk.gamma_abc[14] = Pairing.G1Point(uint256(0x2bcc8273dd835222c9ff963526800ba7749d864792a8f8dd6670f2e12cec70b0), uint256(0x128cfc5a98e9a3d544b5d76b40c2a1f03e966266dae1468df4a5b4979cf250ac));
        vk.gamma_abc[15] = Pairing.G1Point(uint256(0x2c33a6550c59a553817fabfa8924f78038c7b490bf25fe9c01fd84e54a7a108d), uint256(0x133fcd3b5747a3c68b8849f6db4dd2f6067360de14ddca302951a70a7e5a55b0));
        vk.gamma_abc[16] = Pairing.G1Point(uint256(0x0a070a06cbdfb3f3d8192a442eca210248e93f3fd31fae16e0b49d036e2e2e92), uint256(0x17e61b43a89e0bc580fd01f71ae6c0b088a08613d847367806905c3cceb407a3));
        vk.gamma_abc[17] = Pairing.G1Point(uint256(0x06213cebaf521387370747b463747d2add6702f16f34fdd190aa22f63536b8cc), uint256(0x16f739f3eae0f161353f6bca0f8031cc1972b7906ff78ee6abc7b68c363de1bd));
        vk.gamma_abc[18] = Pairing.G1Point(uint256(0x01be9faa1bee610d77509ddc8ce1d080abd1c7e7d881fc747ac068a961655fbe), uint256(0x213bd0344528f90bcd7bdd30efae9a27cd789fc6dcbbd72e04244b32095b81cd));
        vk.gamma_abc[19] = Pairing.G1Point(uint256(0x06262e3affaa0e851b5da112a2e0c82a012942923d6f1585bdb06f4641785c6a), uint256(0x083d0b762076875b0dd0c169fa889dcc0a0597bcc35e828195e48d1d0c32ba01));
        vk.gamma_abc[20] = Pairing.G1Point(uint256(0x1aa6aae8cf9811027c568f9371ba2a9fbc680d3c2f98d9083f64fc28350b8cd0), uint256(0x10e339cac08fbeb9c3b82d8e9b36e7dce2835ff33f8b93cc8c2e4c3a2a16585d));
        vk.gamma_abc[21] = Pairing.G1Point(uint256(0x001e16b085a864d6f0fe488771dd5f74d2575a30dc026c75c614afc038df83b6), uint256(0x052dde9bf70c5e78d1e778f343af6af3b93caa3592a67e51cee351d97aec4f6f));
        vk.gamma_abc[22] = Pairing.G1Point(uint256(0x15cf09b771541f49e3371927caf75b96903d466f73c6a359ce7035075715d442), uint256(0x0ddee78633fa9c7be271f5f7dd6ae74397fde7ba9673d3400515e203b9685d18));
        vk.gamma_abc[23] = Pairing.G1Point(uint256(0x1660ee11f280d223a0ece308fc2eef217af3c396d14b3062005def68886d6a23), uint256(0x20eb79699951bd5c45a3d1abae53dc8e16edf34ba3eb735101bfd326863e05b3));
        vk.gamma_abc[24] = Pairing.G1Point(uint256(0x1e8692cd285a8a41a7f28983df29838f64189d0397305c5d99d17a9d82af212c), uint256(0x1ef76a214e23099004b678f361a4070e147561ad31465f922cb9c5ccaff44956));
        vk.gamma_abc[25] = Pairing.G1Point(uint256(0x133f27f4a036d690a20bc4c700ebcab087e20c98fa3452e498ff8b4cdfd75197), uint256(0x1f2be1f9fcae960bf12a3e3255877d977bac317c75ebff6c55ddd69a400b0d8c));
        vk.gamma_abc[26] = Pairing.G1Point(uint256(0x1fbc468949fe109a7ad3928db991c0ff7f2c03257b6260b9cbfe08bc04810707), uint256(0x171c3e80b9af9b0d967dc7bbd272b89f4403babe34c758396c7f1cf488b98373));
        vk.gamma_abc[27] = Pairing.G1Point(uint256(0x13497838e38d595f0d91e9c249c21e1838e93a2d07ee9218e823c9b886150b53), uint256(0x2b90a23018a9fc6ed7ef09a56d75ef6476775fdd61669d678d1cbbb07320e6c7));
        vk.gamma_abc[28] = Pairing.G1Point(uint256(0x0f25d314a6daefca173c48b4336b57ba889ce6a8c7a4c8fb03d1ae7897808915), uint256(0x260117d26ff43c902d582554657c1824c07be8eb1da73bb06c177e889dadeeaf));
        vk.gamma_abc[29] = Pairing.G1Point(uint256(0x199db906ee9b92cb59ce3972ee698341c46e129986889149f029a7e791a9449e), uint256(0x1bb201643769e68d619d7562019c6819369d3a2a66d85171c70a01c61c28dc3c));
        vk.gamma_abc[30] = Pairing.G1Point(uint256(0x1162cf7bffc0dea081f9ef61b9fcb2b91e2c841a386bc073cd045ccd79129e9d), uint256(0x00c7f76f5970dc2889f6e6483c8a43213a56b4f22a39980372323193bac1fa51));
        vk.gamma_abc[31] = Pairing.G1Point(uint256(0x18ec2c4bb9b1ca8b3e26a6884dc99b00570f7fd7cac65be41898b678e59a46bf), uint256(0x1137c9f548bd8fdd5a391ab6c28e1d9b245afc41023cfa2fbe525b0c75dcc6f7));
        vk.gamma_abc[32] = Pairing.G1Point(uint256(0x0f99688b936cfca36199422e439a7aabda815cae3a4ed61468d8a7ac88d2d1fd), uint256(0x1796849a5045a97a4e346c66ae415e20ed1bbfa6a1c457036dc8b465d9926f08));
        vk.gamma_abc[33] = Pairing.G1Point(uint256(0x17b3925fdfe9fede9324d59f4ee8fb645a2e56394a0af0b2eec352740b38f1c4), uint256(0x001503c968ad2fc9fda943b4b88dc6544cc6139a7a359697b910711e4936dc1e));
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
            Proof memory proof, uint[33] memory input
        ) public view returns (bool r) {
        uint[] memory inputValues = new uint[](33);
        
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
