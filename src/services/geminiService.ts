import { GoogleGenAI, Type, Content } from "@google/genai";
import { getKnowledgeBaseText } from "../resourceDatabase";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Analyze the urgency and priority of a reported issue
export const analyzeTicketPriority = async (description: string): Promise<{ priority: string; reason: string }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `متن زیر گزارش خرابی آسانسور است. لطفاً شدت و اولویت آن را تحلیل کن.
      اگر موضوع ایمنی است (مثل گیر کردن، سقوط، باز شدن درب در حرکت) اولویت "CRITICAL" یا "HIGH".
      اگر خرابی عملکردی است ولی خطر جانی ندارد "MEDIUM".
      اگر سرویس دوره‌ای یا خرابی جزئی (مثل چراغ سوخته) است "LOW".
      
      گزارش: "${description}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: {
              type: Type.STRING,
              enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
              description: "سطح اولویت تشخیص داده شده"
            },
            reason: {
              type: Type.STRING,
              description: "توضیح کوتاه به زبان فارسی در مورد علت انتخاب این اولویت"
            }
          },
          required: ["priority", "reason"]
        }
      }
    });

    const text = response.text;
    if (!text) return { priority: "MEDIUM", reason: "خطا در تحلیل هوشمند" };
    return JSON.parse(text);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return { priority: "MEDIUM", reason: "سرویس هوش مصنوعی در دسترس نیست" };
  }
};

// Suggest technical solutions based on the problem description
export const suggestTechnicalSolution = async (description: string, buildingType: string): Promise<string> => {
  try {
    const knowledgeBase = getKnowledgeBaseText();
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `شما یک متخصص فنی ارشد آسانسور شرکت "پار صنعت صعود" هستید.
      بر اساس دانش فنی زیر و گزارش خرابی، ۳ راهکار فنی پیشنهاد دهید.
      
      دانش فنی شرکت:
      ${knowledgeBase}
      
      گزارش خرابی: "${description}" (ساختمان: ${buildingType})`,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Speed is preferred
      }
    });

    return response.text || "راهکاری یافت نشد.";
  } catch (error) {
    console.error("AI Solution Error:", error);
    return "خطا در دریافت راهکار هوشمند.";
  }
};

// Start a chat session for the Technical Support Bot
// Now populated with the full Resource Database
export const createTechSupportChat = (history?: Content[]) => {
  const knowledgeBase = getKnowledgeBaseText();

  return ai.chats.create({
    model: 'gemini-2.5-flash',
    history: history,
    config: {
      systemInstruction: `شما دستیار هوشمند فنی شرکت "پار صنعت صعود" هستید.
      
      وظیفه شما:
      پاسخگویی به سوالات نصابان و مشتریان بر اساس کاتالوگ‌ها و نقشه‌های فنی شرکت.
      
      بانک اطلاعاتی و فنی شما (دقیقاً بر اساس این اطلاعات پاسخ دهید):
      ${knowledgeBase}

      دستورالعمل‌های پاسخگویی:
      1. لحن: حرفه‌ای، مودبانه و کمک‌کننده (اما نه بیش از حد رسمی).
      2. از نام "آلبرت" استفاده نکنید. خود را "دستیار هوشمند پار صنعت" معرفی کنید.
      3. اگر کد خطایی پرسیده شد (مثلاً E20)، دقیقاً راه حل موجود در دیتابیس را بگویید.
      4. اگر لینک دانلود یا کاتالوگ خواسته شد، بگویید "می‌توانید به بخش مرکز آموزش در پنل مراجعه کنید".
      5. پاسخ‌ها کوتاه و فنی باشند.
      `
    }
  });
};
