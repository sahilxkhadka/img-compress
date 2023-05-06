import { useState } from "react";
import imageCompression from "browser-image-compression";
import "./App.css";
import Loader from "./components/Loader";

function App() {
	const [originalImageFile, setOriginalImageFile] = useState("");
	const [compressedImageFile, setCompressedImageFile] = useState("");
	const [downloadLink, setDownloadLink] = useState("");
	const [compressing, setCompressing] = useState(false);

	const handleImageInput = async (e) => {
		const image = e.target.files[0];
		setOriginalImageFile(image);
		setCompressing(true);
		setTimeout(async () => {
			const options = {
				maxSizeMB: 0.5,
				maxWidthOrHeight: 1920,
				useWebWorker: true,
			};
			try {
				const compressedFile = await imageCompression(image, options);
				setCompressedImageFile(compressedFile);
				setDownloadLink(URL.createObjectURL(compressedFile));
				setCompressing(false);
			} catch (error) {
				console.log(error);
			}
		}, 6000);
	};

	return (
		<>
			<label
				className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
				htmlFor='file_input'
			>
				Upload file
			</label>
			<input
				className='block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400'
				aria-describedby='file_input_help'
				id='file_input'
				type='file'
				onChange={handleImageInput}
				accept='image/*'
			/>
			<p
				className='mt-1 text-sm text-gray-500 dark:text-gray-300'
				id='file_input_help'
			>
				SVG, PNG, JPG or GIF (MAX. 800x400px).
			</p>
			{compressedImageFile && (
				<>
					<img src={URL.createObjectURL(compressedImageFile)} alt='' />
					<a href={downloadLink} download>
						Download
					</a>
				</>
			)}
			{originalImageFile && (
				  
			)}
		</>
	);
}

export default App;
