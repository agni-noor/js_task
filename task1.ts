////////////////Task 1/////////////////////////////

interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

interface PaginatedResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}


async function fetchPosts(limit: number, skip: number): Promise<PaginatedResponse> {
  const url = `https://dummyjson.com/posts?limit=${limit}&skip=${skip}&select=title,reactions,userId`;
  const response = await fetch(url);
  return response.json();
}

async function* paginatePosts(limit: number): AsyncGenerator<Post, void, unknown> {
  let skip = 0;
  let totalFetched = 0;
  let totalPosts = 0;


  const firstPage = await fetchPosts(limit, skip);
  totalPosts = firstPage.total;


  while (totalFetched < totalPosts) {
    const response = await fetchPosts(limit, skip);
    for (const post of response.posts) {
      yield post; 
      totalFetched++;
    }


    skip += limit;
  }
}


async function processPosts(): Promise<void> {
  const limit = 10; 
  const postIterator = paginatePosts(limit); 


  for await (const post of postIterator) {
    console.log(post.title); 
  }
}

processPosts().catch(console.error);



