import ffmpeg from 'fluent-ffmpeg';

const hasAudio = (inputPath) => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(inputPath, (err, metadata) => {
            if (err) {
                reject(err);
            } else {
                const hasAudioStream = metadata.streams.some(stream => stream.codec_type === 'audio');
                resolve(hasAudioStream);
            }
        });
    });
};

const compressVideo = async (inputPath, outputPath) => {
    try {
        const audioPresent = await hasAudio(inputPath);

        return new Promise((resolve, reject) => {
            const ffmpegCommand = ffmpeg(inputPath)
                .output(outputPath)
                .videoCodec('libx264')
                // .videoCodec('libvpx-vp9')
                .videoBitrate('1000k') // Higher bitrate for better quality
                .fps(30)
                .size('1280x1080') // Adjust resolution if needed
                .addOptions([
                    '-crf 24', // Lower value for better quality
                    // '-crf 40', // Lower value for better quality dor vp9 Codec
                    '-movflags +faststart',
                    '-max_muxing_queue_size 1024', // Increase buffer size
                ])
                .on('start', (commandLine) => {
                    console.log('Spawned FFmpeg with command:', commandLine);
                })
                .on('stderr', (stderrLine) => {
                    console.error('FFmpeg stderr:', stderrLine);
                })
                .on('end', () => {
                    console.log('Compression finished successfully');
                    resolve();
                })
                .on('error', (err) => {
                    console.error('Error during compression:', err.message);
                    reject(new Error(`FFmpeg Error: ${err.message}\n${err.stderr}`));
                });

            if (!audioPresent) {
                console.log('No audio stream found, removing audio from output.');
                ffmpegCommand.addOptions(['-an']); // Remove audio if not present
            }

            ffmpegCommand.run();
        });
    } catch (error) {
        console.error('Error checking audio presence:', error.message);
        throw error;
    }
};

export { compressVideo };

