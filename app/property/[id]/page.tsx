export default function Page({ params }: { params: { slug: string } }) {
    return <div>My Property: {params.slug}</div>
}