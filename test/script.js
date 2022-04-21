import http from 'k6/http';
import { check } from 'k6';

export let options = {
    vus: 100,
    iterations: 1000,
};

export default function () {
    const res = http.get(
        'http://localhost:3000/api/v1/users',{
            headers: { 'Content-Type': 'application/json' },
        },
    );

    check(res, { 'status was 200': (r) => r.status == 200 });
}