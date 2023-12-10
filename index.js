import { Router } from 'itty-router';
import { uuid } from '@cfworker/uuid';
import jwt from '@tsndr/cloudflare-worker-jwt';

//Local Database
const db = {
	users: [
		{
			id: 1,
			name: 'user1',
			isAdmin: true,
			isActive: true,
		},
		{
			id: 2,
			name: 'user2',
			isAdmin: false,
			isActive: true,
		},
		{
			id: 3,
			name: 'user3',
			isAdmin: false,
			isActive: true,
		},
		{
			id: 4,
			name: 'user4',
			isAdmin: false,
			isActive: true,
		},
	],
	usersUUID: [
		{
			id: '00000000-0000-0000-0000-000000000001',
			name: 'user1',
			isAdmin: true,
			isActive: true,
		},
		{
			id: '00000000-0000-0000-0000-000000000002',
			name: 'user2',
			isAdmin: false,
			isActive: true,
		},
		{
			id: '00000000-0000-0000-0000-000000000003',
			name: 'user3',
			isAdmin: false,
			isActive: true,
		},
		{
			id: '00000000-0000-0000-0000-000000000004',
			name: 'user4',
			isAdmin: false,
			isActive: true,
		},
	],

	routes: [
		{
			Method: 'GET',
			Enpoint: '/users',
		},
		{
			Method: 'GET',
			Enpoint: '/usersUUID',
		},
		{
			Method: 'GET',
			Enpoint: '/users/:id',
		},
		{
			Method: 'GET',
			Enpoint: '/usersUUID/:uuid',
		},
		{
			Method: 'POST',
			Enpoint: '/users',
		},
		{
			Method: 'POST',
			Enpoint: '/usersUUID',
		},
		{
			Method: 'PUT',
			Enpoint: '/users/:id',
		},
		{
			Method: 'PUT',
			Enpoint: '/usersUUID/:id',
		},
		{
			Method: 'DELETE',
			Enpoint: '/users/:id',
		},
		{
			Method: 'DELETE',
			Enpoint: '/usersSecure/:id',
		},
		{
			Method: 'ALL',
			Enpoint: '/status',
		},
	],
};

// Create a Router
const router = Router();

//Controllers

//getUsers
const getUsers = async (request, env, ctx) => {
	try {
		//Go to db get all Active Users
		const users = await db.users.filter(user => user.isActive);

		//retuen all users
		const returnData = JSON.stringify({ users: users, status: 200 }, null, 2);

		return new Response(returnData);
	} catch (error) {
		const returnData = JSON.stringify({ message: error.message, status: 404 }, null, 2);

		return new Response(returnData);
	}
};

//getUsersUUID
const getUsersUUID = async (request, env, ctx) => {
	try {
		//Go to db get all Active Users
		const users = await db.usersUUID.filter(user => user.isActive);

		const returnData = JSON.stringify({ users: users, status: 200 }, null, 2);

		return new Response(returnData);
	} catch (error) {
		const returnData = JSON.stringify({ message: error.message, status: 404 }, null, 2);

		return new Response(returnData);
	}
};

//getUser get specific User
const getUser = async ({ params }) => {
	try {
		//get params Id
		const userId = parseInt(params.id);

		//Go to db Find User
		const user = db.users.find(user => user.id === userId);

		if (!user) {
			return new Response(JSON.stringify({ message: 'User not found', status: 404 }));
		}

		// Do something with the user data, e.g., send it in the response
		return new Response(JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } });
	} catch (error) {
		// Error response
		return new Response('Failed to fetch user data', { status: 500 });
	}
};

//getUser get specific User UUID
const getUserUUID = async ({ params }) => {
	try {
		//get params UUUID
		const userUUID = params.uuid;

		//Go to db Find User
		const user = db.usersUUID.find(user => user.id === userUUID);

		if (!user) {
			return new Response(JSON.stringify({ message: 'User not found', status: 404 }));
		}

		//send it in the response
		return new Response(JSON.stringify(user), { headers: { 'Content-Type': 'application/json' } });
	} catch (error) {
		//Error response
		return new Response('Failed to fetch user data', { status: 500 });
	}
};

//createUser {"name": "Jonh Doe", "isAdmin": true}
async function createUser(request) {
	try {
		//get json
		const requestData = await request.json();

		//Crete New User
		const newUser = {
			id: db.users.length + 1,
			name: requestData.name,
			isAdmin: requestData.isAdmin || false,
			isActive: true,
		};

		//Save in db
		db.users.push(newUser);

		return new Response(JSON.stringify(newUser), {
			headers: { 'Content-Type': 'application/json' },
			status: 201,
		});
	} catch (error) {
		return new Response('Failed to create user', { status: 500 });
	}
}

//createUserUUID {"name": "Jonh Doe", "isAdmin": true}
async function createUserUUID(request) {
	try {
		//get json
		const requestData = await request.json();

		//Crete New User
		const newUser = {
			id: uuid(),
			name: requestData.name,
			isAdmin: requestData.isAdmin || false,
			isActive: true,
		};

		//Save in db
		db.usersUUID.push(newUser);

		return new Response(JSON.stringify(newUser), {
			headers: { 'Content-Type': 'application/json' },
			status: 201,
		});
	} catch (error) {
		console.error('Error in createUser:', error);
		return new Response('Failed to create user', { status: 500 });
	}
}
//updateUser {"name": "Jonh Doe", "isAdmin": true}
async function updateUser(request) {
	try {
		//Find User
		const userId = parseInt(request.params.id);
		const user = db.users.find(user => user.id === userId);

		if (!user) {
			return new Response(JSON.stringify({ message: 'User not found', status: 404 }));
		}

		// Parse and extract the JSON data from the request
		const requestData = await request.json();

		if (!requestData) {
			return new Response('Invalid JSON data in the request');
		}

		// Update the user's data with the new values
		user.name = requestData.name || user.name;
		user.isAdmin = requestData.isAdmin || user.isAdmin;

		// Send the updated user data in the response
		return new Response(JSON.stringify(user), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error in updateUser:', error);
		return new Response('Failed to update user', { status: 500 });
	}
}
//updateUsersUUID {"name": "Jonh Doe", "isAdmin": true}
async function updateUsersUUID(request) {
	try {
		//Find User
		const useruuid = request.params.id;
		const user = db.usersUUID.find(user => user.id === useruuid);

		if (!user) {
			return new Response(JSON.stringify({ message: 'User not found', status: 404 }));
		}

		// Parse and extract the JSON data from the request
		const requestData = await request.json();

		if (!requestData) {
			return new Response('Invalid JSON data in the request');
		}

		// Update the user's data with the new values
		user.name = requestData.name || user.name;
		user.isAdmin = requestData.isAdmin || user.isAdmin;

		// Send the updated user data in the response
		return new Response(JSON.stringify(user), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.error('Error in updateUser:', error);
		return new Response('Failed to update user', { status: 500 });
	}
}

async function deleteUser(request) {
	try {
		//Find User
		const user = db.users.find(user => user.id === parseInt(request.params.id));

		// If the user is not found, throw an error
		if (!user) {
			return new Response(JSON.stringify({ message: 'User not found', status: 404 }));
		}

		//Delete User
		const index = db.users.indexOf(user);
		db.users.splice(index, 1);

		return new Response(
			JSON.stringify({ message: 'user Deleted with Success', user: user, status: 200 }),
			{ headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ message: 'Failed to delete user', error: error, status: 500 })
		);
	}
}

async function deleteUserSecure(request) {
	const AUTH_HEADER_KEY = 'X-Custom-AUTH';
	const AUTH_HEADER_VALUE = 'authkey';
	const key = request.headers.get(AUTH_HEADER_KEY);

	const [auth, userId] = key.split(';');

	if (auth === AUTH_HEADER_VALUE) {
		try {
			//Find UserRequest
			const userRequest = db.users.find(user => user.id === parseInt(userId));

			//Check if the User that make the Request is Admin
			if (!userRequest.isAdmin) {
				return new Response(
					JSON.stringify({
						message: 'Sorry, you have supplied an key from a User that is Not Admin',
						status: 403,
					}),
					{
						status: 403,
					}
				);
			}

			//Find User
			const user = db.users.find(user => user.id === parseInt(request.params.id));

			// If the user is not found, throw an error
			if (!user) {
				return new Response(JSON.stringify({ message: 'User not found', status: 404 }));
			}

			//Update User
			user.isActive = false;

			//Success
			return new Response(
				JSON.stringify({ message: 'user Deleted with Success', user: user, status: 200 }),
				{ headers: { 'Content-Type': 'application/json' } }
			);
		} catch (error) {
			//Failure
			return new Response(
				JSON.stringify({ message: 'Failed to delete user', error: error, status: 500 })
			);
		}
	}
	// Incorrect key supplied. Reject the request.
	return new Response(
		JSON.stringify({ message: 'Sorry, you have supplied an invalid key.', status: 403 }),
		{
			status: 403,
		}
	);
}

async function login(request) {
	let req_url = new URL(request.url);
	let pw = req_url.searchParams.get('password');
	let email = req_url.searchParams.get('email');

	/*
	const authorization = request.headers.get("Authorization");
	if (!authorization) {
	  return new Response(JSON.stringify({message: 'You need to login.', status: 401}), {
		status: 401
	  });
	}
	const [username, password] = authorization.split(" ");
	*/

	// Parse and extract the JSON data from the request
	const requestData = await request.json();

	const token = await jwt.sign(
		{
			password: requestData.password,
			email: requestData.email,
			exp: Math.floor(Date.now() / 1000) + 2 * (60 * 60), // Expires: Now + 2h
		},
		'secret'
	);

	return new Response(
		JSON.stringify({
			pw: requestData.password,
			email: requestData.email,
			token: token,
			status: 200,
		})
	);
}

//Routes
/*
Index route, a simple Response
*/

router.get('/', async request => {
	let r = {
		TimeStamp: new Date(),
		status: 200,
		message: 'Ok',
		routes_: db.routes,
	};

	const options = { status: 200, message: 'Ok' };

	const returnData = JSON.stringify(r, null, 2);
	const response = new Response(returnData, options);

	return response;
});

router.get('/users', getUsers);

router.get('/usersUUID', getUsersUUID);

router.get('/users/:id', getUser);

router.get('/usersUUID/:uuid', getUserUUID);

router.post('/users', createUser);

router.post('/usersUUID', createUserUUID);

router.put('/users/:id', updateUser);

router.put('/usersUUID/:id', updateUsersUUID);

router.delete('/users/:id', deleteUser);

router.delete('/usersSecure/:id', deleteUserSecure);

router.post('/login', login);
router.get('/statusnocors', (request, env, ctx) => {
	let j = {
		TimeStamp: new Date(),
		Name: ctx,
		Methods: request.method,
		Request: request.cf,
	};

	const returnData = JSON.stringify(j, null, 2);

	return new Response(returnData, {status: 200});
});

router.all('/status', (request, env, ctx) => {
	let j = {
		TimeStamp: new Date(),
		Name: ctx,
		Methods: request.method,
		Request: request.cf,
	};

	const corsHeaders = {
		'Access-Control-Allow-Origin': 'https://joaosgomes.github.io/OWASP-SIS-MES3', ///null, //'',
		'Access-Control-Allow-Methods': 'GET, OPTIONS',
		'Access-Control-Allow-Headers': '*',
		'Content-Type': 'application/json',
	};
	if (request.method.toLowerCase() === 'options') {
		return new Response('ok', {
			headers: corsHeaders,
			status: 200,
		});
	}

	const returnData = JSON.stringify(j, null, 2);

	return new Response(returnData, {
		headers: corsHeaders,
		status: 200
	});
});

/*
This is the last route we define, it will match anything that hasn't hit a route we've defined
above, therefore it's useful as a 404 (and avoids us hitting worker exceptions, so make sure to include it!).

Visit any page that doesn't exist (e.g. /foobar) to see it in action.
*/
router.all('*', () => new Response('404, not found!', { status: 404 }));

export default {
	fetch: router.handle,
};
