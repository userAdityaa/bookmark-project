import { GetServerSideProps } from 'next'

export default function DynamicPage({ content }: { content: string }) {
  return (
    <div>
      <h1>Dynamic Content</h1>
      <p>{content}</p>
    </div>
  )
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { path } = context.params! // Get the dynamic `path` from URL
  
  return {
    props: {
      content: `This is dynamic content for path: ${path}`, // Static content for testing
    },
  }
}
