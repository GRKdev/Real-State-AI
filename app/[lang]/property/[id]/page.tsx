
export default function Page({ params }: { params: { id: string, lang: string } }) {
    console.log(params.lang);
    console.log(params.id);


    return <div className="welcome-message">
        <ul>Property ID: {params.id}</ul>
        Language: {params.lang}
    </div>;

}