import { getBlogs } from '@/lib/blog';
import { IBlogs } from '../type';
import { CardBlog } from '@/components/cardBlog';
import { Suspense } from 'react';
import LoadingComp from '../loading';

export const metadata = {
  title: 'Event Commerce | News',
  description: 'Description News',
};

export default async function NewsPage() {
  const blogs = await getBlogs();
  return (
    <>
      <div className="flex items-center justify-center pt-[100px]">
        <div className="container">
          <h3 className="flex font-bold">INI NEWS PAGE CMS</h3>
          <Suspense fallback={<LoadingComp />}>
            <div className="grid grid-cols-4 max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1 gap-2 mb-[50px]">
              {blogs.map((items: IBlogs) => {
                return (
                  <CardBlog
                    key={items.sys.id}
                    title={items.fields.title}
                    slug={items.fields.slug}
                    image={items.fields.image.fields.file.url}
                    avatar={items.fields.author.fields.avatar.fields.file.url}
                    author={items.fields.author.fields.name}
                    email={items.fields.author.fields.email}
                  />
                );
              })}
            </div>
          </Suspense>
        </div>
      </div>
    </>
  );
}
