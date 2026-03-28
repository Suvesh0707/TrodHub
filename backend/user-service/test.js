import http from 'k6/http';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 100, // 100 requests per second
      timeUnit: '1s',
      duration: '30s',
      preAllocatedVUs: 50,
      maxVUs: 200,
    },
  },
};

export default function () {
  const payload = JSON.stringify({
    fullname: "test user",
    email: `user${__VU}_${__ITER}@mail.com`,
    password: "123456"
  });

  http.post('http://localhost:3000/api/v1/users/register', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
}