// components/SearchBar.tsx
export default function SearchBar({ onSearch }: { onSearch: (value: string) => void }) {
    return (
      <input
        type="text"
        placeholder="Search by team name or ID..."
        className="border p-2 w-full rounded-md"
        onChange={(e) => onSearch(e.target.value)}
      />
    );
  }
      