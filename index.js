import { Router } from 'itty-router';
import { uuid } from '@cfworker/uuid';

// generate a uuid (uses crypto.randomUUID())
//const id = uuid();

//console.log(id);

// Create a new router
const router = Router();

const defaultData = {
	users: [
		{
			id: 1,
			name: 'user1',
			isAdmin: false
		},
		{
			id: 2,
			name: 'user2',
			isAdmin: false
		},
		{
			id: 3,
			name: 'user3',
			isAdmin: false
		},
		{
			id: 4,
			name: 'user4',
			isAdmin: false
		},
	],
	usersUUID: [
		{
			id: '00000000-0000-0000-0000-000000000001',
			name: 'user1',
			isAdmin: false
		},
		{
			id: '00000000-0000-0000-0000-000000000002',
			name: 'user2',
			isAdmin: false
		},
		{
			id: '00000000-0000-0000-0000-000000000003',
			name: 'user3',
			isAdmin: false
		},
		{
			id: '00000000-0000-0000-0000-000000000004',
			name: 'user4',
			isAdmin: false
		},
	],
};


/*
Index route, a simple Response
*/
router.get('/', async request => {
	let j = {
		TimeStamp: new Date(),
	};

	//const blob = new Blob();
	const options = { status: 200, statusText: 'Status Text' };

	const returnData = JSON.stringify(j, null, 2);
	const response = new Response(returnData, options);

	return response;
});

const getUsers = async (request, env, ctx) => {
	try {
		const users = await defaultData.users;

		const returnData = JSON.stringify({ users: users, status: 200 }, null, 2);

		return new Response(returnData);
	} catch (error) {
		const returnData = JSON.stringify({ message: error.message, status: 404 }, null, 2);

		return new Response(returnData);
	}
};

const getUsersUUID = async (request, env, ctx) => {
	try {
		const users = await defaultData.usersUUID;

		const returnData = JSON.stringify({ users: users, status: 200 }, null, 2);

		return new Response(returnData);
	} catch (error) {
		const returnData = JSON.stringify({ message: error.message, status: 404 }, null, 2);

		return new Response(returnData);
	}
};


async function createUserUUID(request) {
	try {
		const requestData = await request.json();
		const newUser = {
			id: uuid(),
			name: requestData.name,
			isAdmin: requestData.isAdmin || false,
		};

		defaultData.usersUUID.push(newUser);

		return new Response(JSON.stringify(newUser), {
			headers: { 'Content-Type': 'application/json' },
			status: 201,
		});
	} catch (error) {
		console.error('Error in createUser:', error);
		return new Response('Failed to create user', { status: 500 });
	}
}

const getUser = async ({ params }) => {
	try {
		const userId = parseInt(params.id);
		const user = defaultData.users.find(user => user.id === userId);

		if (!user) {
			throw new Error('User not found');
		}

		// Do something with the user data, e.g., send it in the response
		return new Response(JSON.stringify(user), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		// Handle errors, e.g., send an error response
		console.error(error);
		return new Response('Failed to fetch user data', { status: 500 });
	}
};


const getUserUUID = async ({ params }) => {
	try {
		console.log(params.uuid);
		const userId = params.uuid;
		const user = defaultData.usersUUID.find(user => user.id === userId);

		if (!user) {
			throw new Error('User not found');
		}

		// Do something with the user data, e.g., send it in the response
		return new Response(JSON.stringify(user), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		// Handle errors, e.g., send an error response
		console.error(error);
		return new Response('Failed to fetch user data', { status: 500 });
	}
};

async function createUser(request) {
	try {
		const requestData = await request.json();
		const newUser = {
			id: defaultData.users.length + 1,
			name: requestData.name,
			isAdmin: requestData.isAdmin || false,
		};

		defaultData.users.push(newUser);

		return new Response(JSON.stringify(newUser), {
			headers: { 'Content-Type': 'application/json' },
			status: 201,
		});
	} catch (error) {
		console.error('Error in createUser:', error);
		return new Response('Failed to create user', { status: 500 });
	}
}

async function updateUser(request) {
	try {
		const userId = parseInt(request.params.id);
		const user = defaultData.users.find(user => user.id === userId);
		console.log(user);
		// If the user is not found, throw an error
		if (!user) {
			return new Response('User not found');
		}

		// Parse and extract the JSON data from the request
		const requestData = await request.json();
		console.log(JSON.stringify(request.json()));
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

router.post('/users', createUser);
router.post('/usersUUID', createUserUUID);

router.put('/users/:id', updateUser);

router.get('/users/:id', getUser);
router.get('/usersUUID/:uuid', getUserUUID);


router.get('/users', getUsers);
router.get('/usersUUID', getUsersUUID);


router.all('/path/', (request, env, ctx) => {
	//({ params, request}) => {
	let j = {
		TimeStamp: new Date(),
		Name: ctx,
		Methods: request.method,
		Request: request.cf,
	};

	const corsHeaders = {
		'Access-Control-Allow-Origin': null, //'',
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
		status: 200,
	});
});

/*
This shows a different HTTP method, a POST.

Try send a POST request using curl or another tool.

Try the below curl command to send JSON:

$ curl -X POST <worker> -H "Content-Type: application/json" -d '{"abc": "def"}'
*/
router.post('/post', async request => {
	// Create a base object with some fields.
	let fields = {
		asn: request.cf.asn,
		colo: request.cf.colo,
	};

	// If the POST data is JSON then attach it to our response.
	if (request.headers.get('Content-Type') === 'application/json') {
		let json = await request.json();
		Object.assign(fields, { json });
	}

	// Serialise the JSON to a string.
	const returnData = JSON.stringify(fields, null, 2);

	return new Response(returnData, {
		headers: {
			'Content-Type': 'application/json',
		},
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
