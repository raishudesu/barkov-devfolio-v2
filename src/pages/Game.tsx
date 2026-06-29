import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Code,
  Terminal,
  Database,
  Cloud,
  Bug,
  Rocket,
  Brain,
  StackSimple,
  GameController,
  ArrowLeft,
  ClockCounterClockwise,
  Shuffle,
  Trophy,
} from "@phosphor-icons/react";

const PAIRS = [
  Code,
  Terminal,
  Database,
  Cloud,
  Bug,
  Rocket,
  Brain,
  StackSimple,
] as const;

const PAIR_COUNT = PAIRS.length;

interface CardData {
  id: number;
  pairIndex: number;
  flipped: boolean;
  matched: boolean;
}

function shuffle<T>(array: T[]): T[] {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createCards(): CardData[] {
  const cards: CardData[] = [];
  for (let i = 0; i < PAIR_COUNT; i++) {
    cards.push({ id: i * 2, pairIndex: i, flipped: false, matched: false });
    cards.push({ id: i * 2 + 1, pairIndex: i, flipped: false, matched: false });
  }
  return shuffle(cards);
}

function fmt(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function Game() {
  const [cards, setCards] = useState<CardData[]>(createCards);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const won = matches === PAIR_COUNT;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (playing && !won) {
      intervalRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, won]);

  function handleClick(id: number) {
    if (busy || won) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;

    if (!playing) setPlaying(true);

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );
    const next = [...flipped, id];
    setFlipped(next);

    if (next.length === 2) {
      setMoves((m) => m + 1);
      setBusy(true);

      const a = cards.find((c) => c.id === next[0]);
      const b = cards.find((c) => c.id === next[1]);
      if (!a || !b) return;

      const delay = a.pairIndex === b.pairIndex ? 400 : 900;
      timeoutRef.current = setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === a.id || c.id === b.id
              ? { ...c, ...(a.pairIndex === b.pairIndex ? { matched: true } : { flipped: false }) }
              : c
          )
        );
        if (a.pairIndex === b.pairIndex) setMatches((m) => m + 1);
        setFlipped([]);
        setBusy(false);
      }, delay);
    }
  }

  const restart = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCards(createCards());
    setMoves(0);
    setMatches(0);
    setTime(0);
    setPlaying(false);
    setFlipped([]);
    setBusy(false);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full">
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeft />
            Back
          </Link>
        </Button>
        <h1 className="text-xl font-bold flex items-center gap-2">
          <GameController />
          Memory Match
        </h1>
        <div className="w-20" />
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <ClockCounterClockwise />
          {fmt(time)}
        </span>
        <span className="flex items-center gap-1">
          <Shuffle />
          {moves} moves
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {cards.map((card) => {
          const Icon = PAIRS[card.pairIndex];
          return (
            <button
              key={card.id}
              onClick={() => handleClick(card.id)}
              disabled={card.matched || card.flipped || busy}
              aria-label={card.flipped || card.matched ? `Card ${card.id + 1}` : "Hidden card"}
              className={`
                relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2
                transition-all duration-300 flex items-center justify-center
                ${
                  card.matched
                    ? "border-green-500 bg-green-500/10 cursor-default"
                    : card.flipped
                    ? "border-primary bg-primary/10 cursor-default"
                    : "border-border bg-muted hover:bg-muted/80 cursor-pointer hover:border-primary/50 hover:scale-105 active:scale-95"
                }
              `}
            >
              {card.flipped || card.matched ? (
                <Icon className="text-2xl" />
              ) : (
                <span className="text-lg font-bold text-muted-foreground/40">
                  ?
                </span>
              )}
            </button>
          );
        })}
      </div>

      {won && (
        <div className="flex flex-col items-center gap-3 p-6 border rounded-lg bg-card text-center">
          <Trophy className="text-yellow-500 text-3xl" />
          <h2 className="text-lg font-bold">You matched all pairs!</h2>
          <p className="text-sm text-muted-foreground">
            Completed in {moves} moves · {fmt(time)}
          </p>
          <Button onClick={restart}>Play Again</Button>
        </div>
      )}

      {matches > 0 && !won && (
        <Button variant="outline" onClick={restart}>
          Restart
        </Button>
      )}
    </div>
  );
}
