import { NextRequest, NextResponse } from 'next/server';  
import OpenAI from 'openai';  

// Configure le client pour Modal/GLM-5 (OpenAI-compatible)  
const openai = new OpenAI({  
  apiKey: process.env.MODAL_API_KEY,  
  baseURL: 'https://api.us-west-2.modal.direct/v1/', // Endpoint gratuit Modal  
});  

export async function POST(req: NextRequest) {  
  try {  
    const { message } = await req.json();  

    if (!message) {  
      return NextResponse.json({ error: 'Message requis' }, { status: 400 });  
    }  

    // Prompt système pour personnaliser l'IA (adapté à Yanis)  
    const systemPrompt = `  
    Tu es l'Assistant Personnel de Yanis Mahmoud, consultant en gestion de projets, stratégie de communication et finance islamique.  
    Tu réponds de manière professionnelle, empathique et éthique (inspiré de la finance islamique : transparence, justice, pas d'intérêt riba).  
    Tu connais son profil :  
    - Fondateur Insaf Finance (liens ressources : https://insaf-finance.com/ressources/)  
    - Expérience en événements multiculturels, podcast PFI (+16k vues)  
    - Compétences : Node.js, GitHub, IA (GLM-5, MiniMax 2.5, Claude Sonnet 4.6, Lovable), Supabase  
    - Basé à Paris, multilingue (français, arabe, anglais).  
    - Entreprise : Mahmoud Yanis (SIREN 919789032, adresse 43 Rue Jean Bart, Cormeilles-en-Parisis).  

    Réponds toujours en français si la question est en français. Sois concis, utile et invite à contacter Yanis via Calendly pour des consultations.  
    `;  

    const completion = await openai.chat.completions.create({  
      model: 'zai-org/GLM-5-FP8', // Modèle GLM-5 sur Modal  
      messages: [  
        { role: 'system', content: systemPrompt },  
        { role: 'user', content: message },  
      ],  
      temperature: 0.7, // Pour des réponses créatives mais fiables  
      max_tokens: 800, // Limite la longueur  
    });  

    const reply = completion.choices[0].message.content;  

    return NextResponse.json({ reply });  
  } catch (error: any) {  
    console.error('Erreur GLM-5 API:', error);  
    return NextResponse.json(  
      { error: 'Erreur lors de la génération de réponse (vérifiez la clé Modal ou les limites)' },  
      { status: 500 }  
    );  
  }  
}  