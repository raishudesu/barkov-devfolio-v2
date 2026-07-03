import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
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
  wrong: boolean;
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
    cards.push({ id: i * 2, pairIndex: i, flipped: false, matched: false, wrong: false });
    cards.push({ id: i * 2 + 1, pairIndex: i, flipped: false, matched: false, wrong: false });
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
  const won = matches === PAIR_COUNT;
  const busy = flipped.length === 2;
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flippingRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (playing && !won) {
      intervalRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, won]);

  useEffect(() => {
    if (flipped.length !== 2) return;

    const [idA, idB] = flipped;
    const cardA = cards.find((c) => c.id === idA);
    const cardB = cards.find((c) => c.id === idB);
    if (!cardA || !cardB) return;

    const isMatch = cardA.pairIndex === cardB.pairIndex;

    if (!isMatch) {
      setCards((prev) =>
        prev.map((c) =>
          c.id === idA || c.id === idB ? { ...c, wrong: true } : c
        )
      );
    }

    const delay = isMatch ? 400 : 900;
    const timerId = setTimeout(() => {
      setCards((prev) =>
        prev.map((c) =>
          c.id === idA || c.id === idB
            ? { ...c, ...(isMatch ? { matched: true } : { wrong: false, flipped: false }) }
            : c
        )
      );
      if (isMatch) setMatches((m) => m + 1);
      flippingRef.current.clear();
      setFlipped([]);
    }, delay);

    timeoutRef.current = timerId;

    return () => {
      clearTimeout(timerId);
      timeoutRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped]);

  function handleClick(id: number) {
    if (busy || won) return;
    if (flippingRef.current.size >= 2) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (flippingRef.current.has(id)) return;

    flippingRef.current.add(id);

    if (flippingRef.current.size === 2) setMoves((m) => m + 1);

    if (!playing) setPlaying(true);

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, flipped: true } : c))
    );
    setFlipped((prev) => [...prev, id]);
  }

  const restart = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCards(createCards());
    setMoves(0);
    setMatches(0);
    setTime(0);
    setPlaying(false);
    flippingRef.current.clear();
    setFlipped([]);
  };

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex items-center justify-between w-full">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.08em] text-gray-400 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={12} />
          back
        </Link>
        <h1 className="text-sm font-bold flex items-center gap-2">
          <GameController size={14} />
          memory match
        </h1>
        <div className="w-16" />
      </div>

      <div className="flex items-center gap-4 text-[11px] uppercase tracking-[0.08em] text-gray-400">
        <span className="flex items-center gap-1">
          <ClockCounterClockwise size={12} />
          {fmt(time)}
        </span>
        <span className="flex items-center gap-1">
          <Shuffle size={12} />
          {moves} moves
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => {
          const Icon = PAIRS[card.pairIndex];
          return (
            <button
              key={card.id}
              onClick={() => handleClick(card.id)}
              disabled={card.matched || card.wrong || card.flipped || busy}
              aria-label={card.flipped || card.matched ? `Card ${card.id + 1}` : "Hidden card"}
              className={`
                relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border
                transition-all duration-300 flex items-center justify-center
                ${
                  card.matched
                    ? "border-green-600 bg-card cursor-default"
                    : card.wrong
                    ? "border-red-500 bg-card cursor-default"
                    : card.flipped
                    ? "border-foreground bg-card cursor-default"
                    : "border-gray-200 bg-card hover:border-foreground/50 cursor-pointer active:scale-95"
                }
              `}
            >
              {card.flipped || card.matched ? (
                <Icon className="text-xl" />
              ) : (
                <span className="text-sm font-bold text-gray-300">?</span>
              )}
            </button>
          );
        })}
      </div>

      {won && (
        <div className="flex flex-col items-center gap-3 p-5 border border-gray-200 rounded-xl bg-card text-center max-w-xs">
          <Trophy size={24} />
          <h2 className="text-sm font-bold">you matched all pairs!</h2>
          <p className="text-[11px] uppercase tracking-[0.08em] text-gray-400">
            {moves} moves · {fmt(time)}
          </p>
          <button
            onClick={restart}
            className="px-4 py-1.5 text-[11px] uppercase tracking-[0.08em] bg-foreground text-background rounded-md hover:opacity-90 transition-opacity"
          >
            play again
          </button>
        </div>
      )}

      {matches > 0 && !won && (
        <button
          onClick={restart}
          className="px-4 py-1.5 text-[11px] uppercase tracking-[0.08em] border border-gray-200 rounded-md text-gray-500 hover:text-foreground hover:border-foreground transition-colors"
        >
          restart
        </button>
      )}
    </div>
  );
}
