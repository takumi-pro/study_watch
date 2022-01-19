const para = document.querySelector('p') as HTMLParagraphElement
const btn = document.querySelector('button') as HTMLButtonElement

btn.addEventListener('click', () => {
    para.textContent = 'igarashitakumi'
})