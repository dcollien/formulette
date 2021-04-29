export default String.raw`
Given:
$$a=\eval{inputa}$$
$$b=\eval{inputb}$$
$$c=\eval{inputc}$$

The Quadratic Formula:
$$
x=\frac{-b\pm \sqrt{b^2-4ac}}{2a}
$$

via substitution becomes:
$$
x=\frac{-\eval{b}\pm \sqrt{\eval{b}^2-4\times\eval{a}\times\eval{c}}}{2\times\eval{a}} 
$$

Giving:
$$x=\eval{xPos} \text{ or } \eval{xNeg}$$
`;
