const loginForm = document.querySelector('#login');

loginForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    let formData = new FormData(e.target)
    const data = Object.fromEntries(formData)
    try{
        fetch('/api/session/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if(res.ok) window.location.href = res.url;
        })
    }catch(error){
        console.log(error)
    }
})