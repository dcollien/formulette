export default String.raw`
Given:
$$a=\${inputa}$$
$$b=\${inputb}$$
$$c=\${inputc}$$

The Quadratic Formula:
$$
x=\frac{-b\pm \sqrt{b^2-4ac}}{2a}
$$

via substitution becomes:
$$
x=\frac{-\${b}\pm \sqrt{\${b}^2-4\times\${a}\times\${c}}}{2\times\${a}} 
$$

Giving:
$$x=\${xPos} \text{ or } \${xNeg}$$
`;
