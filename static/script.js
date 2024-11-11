document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const logoutButton = document.getElementById('logout');
    const devicesTable = document.getElementById('devices-table').getElementsByTagName('tbody')[0];

    // 登录功能
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const account = document.getElementById('account').value;
            const password = document.getElementById('password').value;
            // 这里模拟登录
            console.log('登录账号:', account, '密码:', password);
            alert('登录成功!');
            window.location.href = '/devices.html'; // 登录成功后跳转到设备管理页面
        });
    }

    // 注册功能
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const uname = document.getElementById('uname').value;
            const email = document.getElementById('email').value;
            const tel = document.getElementById('tel').value;
            const password = document.getElementById('password').value;
            // 这里模拟注册
            console.log('注册用户:', uname, '邮箱:', email, '电话:', tel, '密码:', password);
            alert('注册成功!');
            window.location.href = '/login.html'; // 注册成功后跳转到登录页面
        });
    }

    // 退出登录
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            // 模拟退出登录
            console.log('退出登录');
            window.location.href = '/login.html';
        });
    }

    // 获取设备列表
    if (devicesTable) {
        // 模拟设备数据
        const devices = [
            { name: '设备1', status: '在线' },
            { name: '设备2', status: '离线' },
            { name: '设备3', status: '在线' },
        ];

        devices.forEach(device => {
            const row = devicesTable.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            cell1.textContent = device.name;
            cell2.textContent = device.status;
            const button = document.createElement('button');
            button.textContent = '操作';
            button.onclick = () => alert(`操作设备：${device.name}`);
            cell3.appendChild(button);
        });
    }
});
