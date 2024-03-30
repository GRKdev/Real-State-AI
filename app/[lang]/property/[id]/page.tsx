// print id in the url
export default function Page({ params }: { params: { slug: string } }) {
    return <div className="welcome-message">
        Property ID: {params.slug}
    </div>;

}