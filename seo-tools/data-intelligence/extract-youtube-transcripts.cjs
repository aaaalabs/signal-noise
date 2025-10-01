#!/usr/bin/env node
/**
 * YouTube Transcript Extractor
 * Extracts transcripts from YouTube videos for the Founder Paradox article
 * Uses YouTube's public timedtext API (no authentication needed)
 */

const https = require('https');
const fs = require('fs');

// Video IDs from the Founder Paradox article
const videos = [
  {
    id: 'YEgm2jxuoEs',
    title: 'Founder Productivity Challenges',
    context: 'Main video about founder productivity reality'
  },
  {
    id: 'ggkOqyDbpN8',
    title: 'Business Focus Strategy',
    context: 'Quick focus strategy for entrepreneurs (YouTube Short)'
  },
  {
    id: 'Fy9nTbZAoWw',
    title: 'Decision Making Strategy',
    context: 'Strategic decision-making for founders (YouTube Short)'
  },
  {
    id: 'W-OfQnENVaI',
    title: 'Entrepreneurial Focus Methods',
    context: 'Proven focus methods for maintaining entrepreneurial focus'
  },
  {
    id: 'CqUx-GjMnUg',
    title: 'Business Strategy and Focus',
    context: 'Strategic framework for focus'
  }
];

async function getTranscript(videoId) {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    https.get(url, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          // Extract captions URL from page HTML
          const captionsMatch = data.match(/"captions":\{"playerCaptionsTracklistRenderer":\{"captionTracks":\[([^\]]+)\]/);

          if (!captionsMatch) {
            resolve({ error: 'No captions available', videoId });
            return;
          }

          // Extract the first caption track URL
          const urlMatch = captionsMatch[1].match(/"baseUrl":"([^"]+)"/);

          if (!urlMatch) {
            resolve({ error: 'Could not extract caption URL', videoId });
            return;
          }

          const captionUrl = urlMatch[1].replace(/\\u0026/g, '&');

          // Fetch the actual transcript
          https.get(captionUrl, (captionRes) => {
            let captionData = '';

            captionRes.on('data', (chunk) => {
              captionData += chunk;
            });

            captionRes.on('end', () => {
              // Parse XML and extract text
              const textMatches = captionData.matchAll(/<text[^>]*>([^<]+)<\/text>/g);
              const transcript = Array.from(textMatches)
                .map(match => match[1])
                .map(text => text.replace(/&amp;/g, '&')
                                 .replace(/&quot;/g, '"')
                                 .replace(/&#39;/g, "'")
                                 .replace(/&lt;/g, '<')
                                 .replace(/&gt;/g, '>'))
                .join(' ');

              resolve({
                videoId,
                transcript: transcript || 'No transcript text found',
                success: true
              });
            });
          }).on('error', (err) => {
            reject(err);
          });

        } catch (error) {
          resolve({ error: error.message, videoId });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function extractAllTranscripts() {
  console.log('🎬 Extracting YouTube transcripts for Founder Paradox article...\n');

  const results = {};

  for (const video of videos) {
    console.log(`📹 Processing: ${video.title} (${video.id})`);

    try {
      const result = await getTranscript(video.id);

      if (result.error) {
        console.log(`   ❌ Error: ${result.error}`);
        results[video.id] = {
          ...video,
          error: result.error
        };
      } else {
        const wordCount = result.transcript.split(' ').length;
        console.log(`   ✅ Success: ${wordCount} words extracted`);
        results[video.id] = {
          ...video,
          transcript: result.transcript,
          wordCount
        };
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      results[video.id] = {
        ...video,
        error: error.message
      };
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Save results to JSON
  const outputPath = __dirname + '/youtube-transcripts.json';
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\n💾 Transcripts saved to: ${outputPath}`);
  console.log(`\n📊 Summary:`);
  console.log(`   Total videos: ${videos.length}`);
  console.log(`   Successful: ${Object.values(results).filter(r => r.transcript).length}`);
  console.log(`   Failed: ${Object.values(results).filter(r => r.error).length}`);
}

// Run the extraction
extractAllTranscripts().catch(console.error);
