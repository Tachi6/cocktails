// Load template and return only the content of this template 
export const loadTemplate = async (id) => {
    const resp = await fetch('./template/templates.html')

    const container = document.createElement('div')
    container.innerHTML = await resp.text()
    
    return container.querySelector(id).content
}