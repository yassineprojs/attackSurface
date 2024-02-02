export default /*glsl*/ `
varying vec2 vUv;
uniform float uTime;
void main(){
  float dashx = sin (vUv.x*20.0 + uTime );
  if(dashx<0.0) discard;

  
  gl_FragColor = vec4(vUv.x,0.0,0.0,1.0);
}`;
