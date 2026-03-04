import { useQuery } from "@tanstack/react-query";

interface ExampleData {
  id: number;
  title: string;
}

async function fetchExampleData(): Promise<ExampleData[]> {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=5"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export function useExampleQuery() {
  return useQuery({
    queryKey: ["example"],
    queryFn: fetchExampleData,
  });
}
