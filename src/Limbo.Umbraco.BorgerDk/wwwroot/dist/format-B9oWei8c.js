function r(a) {
  if (!a) return "";
  const t = new Date(a * 1e3), e = (n) => n.toString().padStart(2, "0");
  return `${t.getFullYear()}-${e(t.getMonth() + 1)}-${e(t.getDate())} ${e(t.getHours())}:${e(t.getMinutes())}`;
}
export {
  r as f
};
//# sourceMappingURL=format-B9oWei8c.js.map
