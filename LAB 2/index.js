document.getElementById('fetch-button').addEventListener('click', async () => {
	const users = await fetchDataUser();

	await fetchData(users);
});

document.getElementById('post-form').addEventListener('submit', async (event) => {
	event.preventDefault();
	const userId = document.getElementById('user-id').value;
	const title = document.getElementById('title').value;
	const body = document.getElementById('body').value;

	const newPost = {
		userId,
		title,
		body,
	};

	try {
		const response = await fetch('http://localhost:3004/posts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newPost),
		});

		if (!response.ok) {
			throw new Error('Failed to create post');
		}
		console.log(newPost);

		const users = await fetchDataUser();
		await fetchData(users);

		document.getElementById('post-form').reset();
	} catch (error) {
		console.error('Error creating post:', error);
	}
});

async function fetchData(users) {
	renderLoadingState();
	try {
		const response = await fetch('http://localhost:3004/posts');
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		renderData(data, users);
	} catch (error) {
		renderErrorState();
	}
}

function renderData(data, users) {
	const container = document.getElementById('data-container');
	container.innerHTML = ''; // Clear previous data

	if (data.length > 0) {
		data.forEach((item) => {
			const postDiv = document.createElement('div');
			postDiv.className = 'post';
			const usuario = users?.find((user) => user.id === item.userId + '');

			if (usuario) {
				const userName = document.createElement('p');
				userName.className = 'user-name';
				userName.innerHTML = `${usuario.username}`;
				postDiv.appendChild(userName);
			}

			const id = document.createElement('p');
			id.className = 'id';
			id.innerHTML = item.id;
			postDiv.appendChild(id);

			const title = document.createElement('p');
			title.className = 'title';
			title.innerHTML = item.title;
			postDiv.appendChild(title);

			const body = document.createElement('p');
			body.className = 'body';
			body.innerHTML = item.body;
			postDiv.appendChild(body);

			const deleteButton = document.createElement('button');
			deleteButton.innerText = 'Delete';
			deleteButton.className = 'delete-button';
			deleteButton.addEventListener('click', async () => {
				await deletePost(item.id);
				const users = await fetchDataUser();
				await fetchData(users);
			});
			postDiv.appendChild(deleteButton);

			container.appendChild(postDiv);
		});
	}
}

async function fetchDataUser() {
	try {
		const response = await fetch('http://localhost:3004/users');
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const dataUser = await response.json();
		// renderDataUser(dataUser);
		return dataUser;
	} catch (error) {
		renderErrorUserState();
	}
}

function renderDataUser(dataUser) {
	console.log(dataUser);
	const containerUser = document.getElementById('data-UserContainer');
	containerUser.innerHTML = ''; // Clear previous data

	if (dataUser.length > 0) {
		dataUser.forEach((item) => {
			// const user = dataUser.find((user = dataUser.id === data.userId));
			const user = document.createElement('p');
			user.className = 'item';
			user.innerHTML = item.name;
			containerUser.appendChild(user);
		});
	}
}

async function deletePost(postId) {
	try {
		const response = await fetch(`http://localhost:3004/posts/${postId}`, {
			method: 'DELETE',
		});

		if (!response.ok) {
			throw new Error('Failed to delete post');
		}

		console.log(`Post ${postId} deleted successfully`);
	} catch (error) {
		console.error('Error deleting post:', error);
	}
}

function renderErrorState() {
	const container = document.getElementById('data-container');
	container.innerHTML = '';
	container.innerHTML = '<p>Failed to load data</p>';
	console.log('Failed to load data');
}

function renderErrorUserState() {
	const container = document.getElementById('data-UserContainer');
	container.innerHTML = ''; // Clear previous data
	container.innerHTML = '<p>Failed to load data</p>';
	console.log('Failed to load data');
}

function renderLoadingState() {
	const container = document.getElementById('data-container');
	container.innerHTML = '';
	container.innerHTML = '<p>Loading...</p>';
}
