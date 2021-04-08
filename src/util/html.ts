export function stripHTML(text: string): string {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = text;
  return tmp.textContent || tmp.innerText || "";
}
