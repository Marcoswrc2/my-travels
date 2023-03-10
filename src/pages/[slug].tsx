import { GetStaticProps, NextPage } from 'next'
import PageTemplate from '@/templates/Pages'
import client from '@/graphql/client'
import { GET_PAGES, GET_PAGE_BY_SLUG } from '@/graphql/queries'
import { useRouter } from 'next/router'
import { PageTemplateProps } from '@/templates/Pages'
import { GetPageBySlugQuery, PagesQuery } from '@/graphql/generated/graphql'

const Page = (props: PageTemplateProps) => {
  const router = useRouter()

  //retorna um loading, qq coisa enquanto tá sendo criada
  if (router.isFallback) return null
  return <PageTemplate {...props} />
}
export const getStaticPaths = async () => {
  const { pages } = await client.request<PagesQuery>(GET_PAGES, {
    first: 3
  })
  const paths = pages.map(({ slug }) => ({ params: { slug } }))

  return { paths, fallback: true }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { page } = await client.request<GetPageBySlugQuery>(GET_PAGE_BY_SLUG, {
    slug: `${params?.slug}`
  })

  if (!page) return { notFound: true }

  return {
    props: {
      heading: page.heading,
      body: page.body.html
    }
  }
}

export default Page
