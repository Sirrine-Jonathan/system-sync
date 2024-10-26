import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Becoming You" },
    { name: "description", content: "Welcome to Becoming You" },
  ];
};

export default function Index() {
  return (
    <div className="mx-auto flex min-h-screen flex-col items-center justify-center p-4">
      <header className="flex flex-col items-center justify-center gap-4 p-4">
        <h1 className="text-3xl font-bold">Becoming You!</h1>
      </header>
      <a
        href="/auth"
        className="inline-block rounded-lg bg-gray-100 px-5 py-3 font-medium text-gray-900"
      >
        Login with Google <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  );
}
