const registerForm = document.querySelector('#register');

registerForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    let formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    
    try{
        fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if(res.ok) window.location.href = "/static/login"
        })
    }catch(error){
        console.log(error)
    }
})