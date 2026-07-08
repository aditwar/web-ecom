import ShareButton from '@/components/share';
import Wrapper from '@/components/wrapper';
import { formatDate } from '@/helper/formatters';
import { getBlogSlug, getBlogs } from '@/lib/blog';
import { IBlogs } from '@/app/type';
import {
  Options,
  documentToReactComponents,
} from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import Link from 'next/link';

export const revalidate = 3600;

export const generateStaticParams = async () => {
  const users = await getBlogs();

  return users.map((blog: IBlogs) => ({
    params: {
      slug: blog.fields.slug,
    },
  }));
};

export async function generateMetadata(props: { params: { slug: string } }) {
  const { slug } = await props.params;
  const blog = await getBlogSlug(slug);

  return {
    title: blog.fields.title,
    description: blog.fields.title,
    authors: blog.fields.author.fields.name,
    openGraph: {
      images: [
        `https:${blog.fields.image.fields.file.url}`,
        `https:${blog.fields.author.fields.avatar.fields.file.url}`,
      ],
    },
  };
}

export default async function BlogDetail(props: { params: { slug: string } }) {
  const { slug } = await props.params;
  const blog = await getBlogSlug(slug);

  const options: Options = {
    renderNode: {
      [BLOCKS.HEADING_1]: (_node, children) => (
        <h1 className="my-[2.5px] md:text-3xl sm:text-2xl text-xl">
          {children}
        </h1>
      ),
      [BLOCKS.HEADING_2]: (_node, children) => (
        <h2 className="my-[2.5px] md:text-2xl sm:text-xl text-lg">
          {children}
        </h2>
      ),
      [BLOCKS.HEADING_3]: (_node, children) => (
        <h3 className="my-5 md:text-xl sm:text-lg text-base">{children}</h3>
      ),
      [BLOCKS.HEADING_4]: (_node, children) => (
        <h4 className="my-5 md:text-lg sm:text-base text-sm">{children}</h4>
      ),
      [BLOCKS.HEADING_5]: (_node, children) => (
        <h5 className="my-10 md:text-base sm:text-sm text-xs">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (_node, children) => (
        <h6 className="my-10 mb-20 md:text-base sm:text-sm text-xs">
          {children}
        </h6>
      ),
      [BLOCKS.OL_LIST]: (_node, children) => (
        <ol className="list-decimal ml-5">{children}</ol>
      ),
      [BLOCKS.UL_LIST]: (_node, children) => (
        <ul className="list-disc ml-5">{children}</ul>
      ),
      [BLOCKS.LIST_ITEM]: (_node, children) => (
        <li className="my-2">{children}</li>
      ),
    },
  };

  return (
    <div className="mb-[50px]">
      <Wrapper>
        <div className="flex">
          <div className="flex-1 sticky max-md:hidden top-[100px] h-full">
            <Link href={`/news`} className="flex items-center gap-2">
              <svg
                className="rtl:rotate-180 w-3.5 h-3.5 ms-2"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
              back
            </Link>
            <ShareButton slug={blog.fields.slug} className="mt-5" />
          </div>
          <div className="flex-[2] pr-52 max-lg:pr-0">
            <h5 className="mb-2 text-[32px] max-md:text-[24px] font-bold tracking-tight text-gray-900 dark:text-white">
              {blog.fields.title}
            </h5>
            <div className="flex gap-1">
              <p className="font-bold text-[18px] max-md:text-[14px]">
                {blog.fields.author.fields.name}
              </p>
              ∙
              <p className="text-[18px] max-md:text-[14px]">
                {formatDate(blog.fields.date)}
              </p>
            </div>
            <ShareButton
              slug={blog.fields.slug}
              className="hidden max-md:block"
            />
            <img
              className="h-[350px] max-sm:h-[200px] max-md:h-[300px] w-full my-5 shadow"
              src={`https:${blog.fields.image.fields.file.url}`}
              alt={blog.fields.title}
            />
            {documentToReactComponents(blog.fields.content, options)}
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
