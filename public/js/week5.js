const users = [
    { "id": 1, "username": "admin", "password": "1111", "role": 1 },
    { "id": 2, "username": "aaa", "password": "2222", "role": 2 },
    { "id": 3, "username": "bbb", "password": "333", "role": 2 }
];



function login() {
    try {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const foundUser = users.find(user => user.username === username);

        if (foundUser && foundUser.password === password) {
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: 'Welcome!'
                ,width: 600,
                padding: '3em',
                color: '#76dd6a',
                backdrop: `
                  rgba(17, 255, 0,0.4)
                  url("/public/img/catt.gif")
                  left top
                  
                  no-repeat
                `,
                confirmButtonText: 'OK'
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.assign('hw52.html');
              }
                
                
            });
            
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Login failed, try again!!!'
                ,width: 600,
                padding: '3em',
                color: '#dd796a',
                backdrop: `
                  rgba(255, 0, 0,0.4)
                  url("/public/img/catt.gif")
                  left top
                  
                  no-repeat
                `
                
            });
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

