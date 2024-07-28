document.addEventListener('DOMContentLoaded', () => {
    const serverStatus = document.getElementById('server-status');
    const refreshButton = document.getElementById('refresh-button');
    const playerList = document.getElementById('player-list');

    async function fetchServerStatus() {
        try {
            const response = await fetch('https://api.mcsrvstat.us/3/sociedadcraft.lat');
            const data = await response.json();

            if (data.online) {
                const motdHTML = data.motd.html.join('<br><br>');
                serverStatus.innerHTML = `
                    <p>Servidor en línea ✅</p>
                    <p>Jugadores: ${data.players.online}/${data.players.max} 👥</p>
                    <p>Versión: ${data.version} 📖</p>
                    <p>Software: Fabric 🎮</p>
                    <img src="https://api.mcsrvstat.us/icon/sociedadcraft.lat" alt="Icono">
                    <div class="motd-container">${motdHTML}</div>
                `;
                updatePlayerInfo(data.players.list);
            } else {
                serverStatus.innerHTML = '<p>Servidor fuera de línea ❎</p>';
                playerList.innerHTML = '<li>No hay jugadores en línea</li>';
            }
        } catch (error) {
            serverStatus.innerHTML = '<p>Error al obtener el estado del servidor</p>';
            playerList.innerHTML = '<li>Error al obtener la información de los jugadores</li>';
        }
    }

    function updatePlayerInfo(players) {
        if (players && players.length > 0) {
            playerList.innerHTML = players.map(player => `
                <li>
                    <img src="https://minotar.net/avatar/${player.name}/32" alt="Avatar de ${player.name}">
                    <p>${player.name}</p>
                </li>
            `).join('');
        } else {
            playerList.innerHTML = '<li>No hay jugadores en línea</li>';
        }
    }

    refreshButton.addEventListener('click', fetchServerStatus);

    fetchServerStatus();
    cargarPosts();
});

async function cargarPosts() {
    try {
        const response = await axios.get('./news.json');
        const posts = response.data;

        const postsContainer = document.getElementById('postsContainer');
        postsContainer.innerHTML = posts.map(post => `
            <div class="post">
                <h2>${post.titulo}</h2>
                <div class="content">
                    <b>${post.contenido}</b>
                    <ul>
                        ${post.nuevas_cosas ? post.nuevas_cosas.map(item => `<li>${item}</li>`).join('') : ''}
                    </ul>
                    <p>${post.fecha}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error al cargar los posts:', error);
        document.getElementById('postsContainer').innerHTML = '<p>No se pudo cargar la información de noticias.</p>';
    }
}
document.addEventListener('DOMContentLoaded', cargarPosts);

