import { NextRequest , NextResponse } from 'next/server';
// NextRequest cest la requette HTTP comme GET /api/youtube?q=chat
// NextResponse envoyer la reponse 
const YOUTUBE_API_KEY= process.env.YOUTUBE_API_KEY; //Une variable d’environnement est une façon sécurisée de stocker des informations sensibles ou spécifiques à ton environnement (machine, config perso) , clé api => Elle identifie ton application auprès du serveur distant.
export async function GET(req:NextRequest){ // fonction appelé automatiquement quand une requette GET est faite sur api/youtube 
    const query = req.nextUrl.searchParams.get('q');
    if(!query || query.trim()==''){// si l'utilisateur n'a rien tapé
        return NextResponse.json({items:[]});//le contenu de json cest items qui est un tableau 
    }
    // on construit lurl youtube 
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`;
    try{
        const res = await fetch(url);
        const data= await res.json();
        const items = data.items?.map((item:any)=> ({ // 
            title: item.snippet.title,
            url:`https://www.youtube.com/watch?v=${item.id.videoId}`,
            thumbnail:item.snippet.thumbnails.medium.url
        })) || [];
        return NextResponse.json({items});
    }catch(error){
        console.error('Erreur API Youtube :',error);
        return NextResponse.json({items:[],error:'Erreur lors de la récupération des vidéos.'});
    }
    

}

