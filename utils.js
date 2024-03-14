export function createElementFromTemplate(template) {
  const tmpElement = document.createElement('div');
  tmpElement.innerHTML = template.trim();
  
  return tmpElement.firstChild;
}