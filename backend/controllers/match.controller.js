const pdfParse = require("pdf-parse");
const Groq = require("groq-sdk");
const Drive = require("../models/Drive.model");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const matchResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No PDF uploaded" });

    const drive = await Drive.findById(req.params.driveId);
    if (!drive) return res.status(404).json({ message: "Drive not found" });

    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text?.trim();
    if (!resumeText) return res.status(400).json({ message: "Could not extract text from PDF" });

    const prompt = `You are an expert technical recruiter analyzing a resume for a job position.

JOB DETAILS:
- Company: ${drive.companyName}
- Role: ${drive.jobRole}
- Required CGPA: ${drive.eligibility?.minCgpa}
- Allowed Branches: ${drive.eligibility?.allowedBranches?.join(", ") || "All"}
- Interview Rounds: ${drive.rounds?.join(", ")}

RESUME TEXT:
${resumeText.slice(0, 3000)}

Analyze this resume for the job and respond with ONLY a valid JSON object, no markdown, no explanation, just raw JSON:
{
  "matchScore": <number 0-100>,
  "matchLevel": "<Excellent|Good|Fair|Low>",
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "strengths": ["strength1", "strength2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "summary": "<2 sentence overall assessment>"
}`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
    });

    const text = completion.choices[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return res.status(500).json({ message: "Failed to parse AI response" });

    const analysis = JSON.parse(jsonMatch[0]);
    res.json(analysis);
  } catch (error) {
    console.error("Match error:", error.message);
    res.status(500).json({ message: error.message || "Resume matching failed" });
  }
};

module.exports = { matchResume };