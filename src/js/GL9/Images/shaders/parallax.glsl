float parallax(float offset, float scrollHeight, float activator) {
  float pKoef = 0.5;
  return (offset + size.y / 2.) / scrollHeight * pKoef * activator;
}