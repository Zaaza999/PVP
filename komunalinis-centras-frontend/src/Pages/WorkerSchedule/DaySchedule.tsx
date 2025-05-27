import React, { useEffect, useMemo, useState } from "react"; 
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import dayjs, { Dayjs } from "dayjs";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  getEmployeeDaySchedule,
  addEmployeeTask,
} from "../Axios/apiServises";

/* -------------------------------------------------- */
const STEP_MIN = 30;
const DAY_START_MIN = 8 * 60; // 08:00
const DAY_END_MIN = 17 * 60;  // 17:00

interface SlotDto {
  timeSlotId: number;
  slotDate: string;
  timeFrom: string;
  timeTo: string;
  topic?: string;
  description?: string | null;
  isTaken: boolean;
  forRezervation: boolean;
}

interface Segment {
  start: number;
  end: number;
}

interface Row {
  start: number;
  end: number;
  topic?: string;
  description?: string | null;
  isFree: boolean;
  forRezervation?: boolean;
  isTaken?: boolean;
}

/* helpers */
const parseHHMM = (t: string): number => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const formatHHMM = (m: number): string => {
  const h = Math.floor(m / 60).toString().padStart(2, "0");
  const mm = (m % 60).toString().padStart(2, "0");
  return `${h}:${mm}`;
};

export default function DaySchedule() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const [date, setDate] = useState<Dayjs>(() => dayjs());
  const [slots, setSlots] = useState<SlotDto[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");

  /* fetch schedule */
  const fetchSchedule = () => {
    if (!employeeId) return;
    getEmployeeDaySchedule(employeeId, date.format("YYYY-MM-DD")).then((d) =>
      setSlots(d as SlotDto[])
    );
  };
  useEffect(fetchSchedule, [employeeId, date]);

  /* busy segments */
  const busySegments: Segment[] = useMemo(() => {
    const arr = slots.map((s) => ({
      start: parseHHMM(s.timeFrom.slice(0, 5)),
      end: parseHHMM(s.timeTo.slice(0, 5)),
    }));
    arr.sort((a, b) => a.start - b.start);
    const merged: Segment[] = [];
    arr.forEach((seg) => {
      if (!merged.length) merged.push({ ...seg });
      else {
        const last = merged[merged.length - 1];
        if (seg.start <= last.end) last.end = Math.max(last.end, seg.end);
        else merged.push({ ...seg });
      }
    });
    return merged;
  }, [slots]);

  /* free segments */
  const freeSegments: Segment[] = useMemo(() => {
    const free: Segment[] = [];
    let cursor = DAY_START_MIN;
    busySegments.forEach((b) => {
      if (cursor < b.start) free.push({ start: cursor, end: b.start });
      cursor = Math.max(cursor, b.end);
    });
    if (cursor < DAY_END_MIN) free.push({ start: cursor, end: DAY_END_MIN });
    return free;
  }, [busySegments]);

  /* combined rows */
  const rows: Row[] = useMemo(() => {
    const list: Row[] = [];
    let cursor = DAY_START_MIN;
    const sorted = [...slots].sort(
      (a, b) => parseHHMM(a.timeFrom.slice(0, 5)) - parseHHMM(b.timeFrom.slice(0, 5))
    );
    sorted.forEach((s) => {
      const start = parseHHMM(s.timeFrom.slice(0, 5));
      const end = parseHHMM(s.timeTo.slice(0, 5));
      if (cursor < start) list.push({ start: cursor, end: start, isFree: true });
      list.push({
        start,
        end,
        topic: s.topic,
        description: s.description,
        isFree: false,
        forRezervation: s.forRezervation,
        isTaken: s.isTaken,
      });
      cursor = end;
    });
    if (cursor < DAY_END_MIN) list.push({ start: cursor, end: DAY_END_MIN, isFree: true });
    return list;
  }, [slots]);

  /* from options */
  const fromOptions = useMemo<string[]>(() => {
    const opts: string[] = [];
    freeSegments.forEach((seg) => {
      for (let m = seg.start; m + STEP_MIN <= seg.end; m += STEP_MIN) {
        opts.push(formatHHMM(m));
      }
    });
    return opts;
  }, [freeSegments]);

  /* to options */
  const toOptions = useMemo<string[]>(() => {
    if (!from) return [];
    const fm = parseHHMM(from);
    const seg = freeSegments.find((s) => fm >= s.start && fm < s.end);
    if (!seg) return [];
    const opts: string[] = [];
    for (let m = fm + STEP_MIN; m <= seg.end; m += STEP_MIN) {
      opts.push(formatHHMM(m));
    }
    return opts;
  }, [from, freeSegments]);

  /* add task */
  const handleAdd = () => {
    if (!employeeId || !from || !to) return;
    addEmployeeTask(employeeId, { date: date.format("YYYY-MM-DD"), from, to, topic, description })
      .then(() => {
        setOpenAdd(false);
        setTopic("");
        setDescription("");
        setFrom("");
        setTo("");
        fetchSchedule();
      })
      .catch(console.error);
  };

  return (
    <div className="container">
      <Box>
        {/* Date navigation */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <Button onClick={() => setDate((d) => d.subtract(1, "day"))}>◀</Button>
          <Typography variant="h6" sx={{ minWidth: 110, textAlign: "center" }}>
            {date.format("YYYY-MM-DD")}
          </Typography>
          <Button onClick={() => setDate((d) => d.add(1, "day"))}>▶</Button>
        </Box>

        {/* schedule table */}
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Laikas</TableCell>
              <TableCell>Tema</TableCell>
              <TableCell>Aprašymas</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i} sx={{ background: r.isFree ? "#f8fff8" : "inherit" }}>
                <TableCell>{formatHHMM(r.start)}–{formatHHMM(r.end)}</TableCell>
                <TableCell>{r.isFree ? "-" : r.topic || "-"}</TableCell>
                <TableCell>
                  {r.isFree
                    ? "Laisva"
                    : r.forRezervation
                    ? r.isTaken
                      ? r.description || "Rezervuota"
                      : "Laisva klientams"
                    : r.description || "Vidinis darbas"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Button variant="contained" sx={{ mt: 2 }} onClick={() => setOpenAdd(true)}>
          + Pridėti darbą
        </Button> 
        {localStorage.getItem("userRole") !== "worker_admin" && (
        <div className="button-wrapper">
          <Link to="/" className="back-button">
            Grįžti į pagrindinį puslapį
          </Link>
        </div>  
        )} 
        {localStorage.getItem("userRole") === "worker_admin" && (
        <div className="button-wrapper">
          <Link to={"/worker-list"} className="back-button">
            Atgal
          </Link>
        </div> 
        )}

        {/* dialog */}
        <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
          <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 300 }}>
            <TextField label="Tema" value={topic} onChange={(e) => setTopic(e.target.value)} />
            <TextField label="Aprašymas" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Select value={from} onChange={(e) => setFrom(e.target.value as string)} displayEmpty>
              <MenuItem disabled value="">Nuo</MenuItem>
              {fromOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
            <Select value={to} onChange={(e) => setTo(e.target.value as string)} displayEmpty disabled={!from}>
              <MenuItem disabled value="">Iki</MenuItem>
              {toOptions.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAdd(false)}>Atšaukti</Button>
            <Button onClick={handleAdd} variant="contained" disabled={!from || !to}>
              Išsaugoti
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
    
  );
}
