// print id in the url
export default function Page({ params }: { params: { slug: string } }) {
    return <div>Property ID: {params.slug}
    </div>;

}