// Raw test without Next.js imports
export async function GET() {
  return new Response('Hello World', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}

export async function POST() {
  return new Response('POST received', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
