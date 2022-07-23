import Head from 'next/head';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import {
	Box,
	Button,
	Checkbox,
	Container,
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Select,
	TextField,
	Tooltip,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useEffect, useState } from 'react';

const useStyles = makeStyles(() => ({
	center: {
		width: '100%',
		height: '100vh',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
	},
}));

export default function Home() {
	const [page, setPage] = useState('picker');
	const [settings, setSettings] = useState({
		showSeconds: true,
		showMinutes: true,
		showHours: false,
	});
	const [untilWhat, setUntilWhat] = useState('class starts');
	const [timeUpMessage, setTimeUpMessage] = useState(
		'Class will start soon...',
	);
	const [time, setTime] = useState(new Date());
	const [timeUntil, setTimeUntil] = useState();
	const [selectedTimeFormatting, setSelectedTimeFormatting] = useState([
		'Minutes',
		'Seconds',
	]);
	const classes = useStyles();
	useEffect(() => {
		setSettings({
			showSeconds: selectedTimeFormatting.includes('Seconds'),
			showMinutes: selectedTimeFormatting.includes('Minutes'),
			showHours: selectedTimeFormatting.includes('Hours'),
		});
	}, [selectedTimeFormatting]);
	useEffect(() => {
		const interval = setInterval(() => {
			const s = (time) => (time === 1 ? '' : 's');

			const timeLeft = new Date(time - Date.now());
			if (timeLeft.getSeconds() <= 0 && timeLeft.getMinutes() <= 0) {
				setTimeUntil(timeUpMessage);
				clearInterval(interval);
				return;
			}
			setTimeUntil(
				`${
					settings.showHours
						? `${timeLeft.getHours()} hour${s(timeLeft.getHours())}`
						: ''
				} ${
					settings.showMinutes
						? `${timeLeft.getMinutes()} minute${s(
								timeLeft.getMinutes(),
						  )}`
						: ''
				} ${
					settings.showSeconds
						? `${timeLeft.getSeconds()} second${s(
								timeLeft.getSeconds(),
						  )}`
						: ''
				} until ${untilWhat}`,
			);
		}, 1000);
		return () => clearInterval(interval);
	}, [time, settings, untilWhat, timeUpMessage]);
	let main;
	if (page === 'picker') {
		main = (
			<Container maxWidth="md">
				<h1>Pick a time</h1>
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<TimePicker
						label="Time"
						value={time}
						onChange={(val) => setTime(val)}
						renderInput={(params) => <TextField {...params} />}
					/>
				</LocalizationProvider>
				<Tooltip
					title={
						<>
							<p>This controls what the time will look like</p>
							<p>
								Example:
								<br />
								Selecting minutes and seconds would display the
								time in the format:
								<br />
								<code>M minutes S seconds</code>
							</p>
						</>
					}
				>
					<h1>Time formatting settings</h1>
				</Tooltip>
				<FormControl sx={{ m: 1, width: 300 }}>
					<InputLabel id="time-formatting">
						Time formatting
					</InputLabel>
					<Select
						labelId="time-formatting"
						multiple
						value={selectedTimeFormatting}
						onChange={(e) => {
							const value = e.target.value;
							setSelectedTimeFormatting(
								typeof value === 'string'
									? value.split(',')
									: value,
							);
						}}
						input={<OutlinedInput label="Time formatting" />}
						renderValue={(selected) => selected.join(', ')}
					>
						{['Hours', 'Minutes', 'Seconds'].map((name) => (
							<MenuItem key={name} value={name}>
								<Checkbox
									checked={
										selectedTimeFormatting.indexOf(name) >
										-1
									}
								/>
								<ListItemText primary={name} />
							</MenuItem>
						))}
					</Select>
				</FormControl>
				<Tooltip
					title={
						<>
							<p>
								This is what is starting at the time you
								selected
							</p>
							<p>
								Example:
								<br />
								Inputting &quot;class starts&quot; would
								display:
								<br />
								<code>TIME until class starts</code>
							</p>
						</>
					}
				>
					<h1>What will start</h1>
				</Tooltip>
				<TextField
					label="What will start"
					value={untilWhat}
					onChange={(e) => setUntilWhat(e.target.value)}
				/>
				<Tooltip
					title={
						<>
							<p>
								This is what will be displayed once the
								countdown has finished.
							</p>
						</>
					}
				>
					<h1>Time up message</h1>
				</Tooltip>
				<TextField
					label="Time up message"
					value={timeUpMessage}
					onChange={(e) => setTimeUpMessage(e.target.value)}
				/>
				<br />
				<Button
					variant="contained"
					onClick={() => setPage('display')}
					style={{ marginTop: 10 }}
				>
					Let&apos;s go!
				</Button>
			</Container>
		);
	} else if (page === 'display') {
		main = (
			<Container maxWidth="md">
				<Box className={classes.center}>
					<h1>{timeUntil}</h1>
					<Button onClick={() => setPage('picker')}>
						Pick another time
					</Button>
				</Box>
			</Container>
		);
	}
	return (
		<div>
			<Head>
				<title>Time until class</title>
				<meta
					name="description"
					content="Display how much time is left until your class starts"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			{main}
		</div>
	);
}
