export function ExtraOptionsCheckbox({ options }: { options: any[] }) {

    return (
        <div>
            {options.map(option => (
                <div key={option.id} className="hover:text-orange-500">
                    <input
                        type="checkbox"
                        className="accent-orange-500"
                        id={option.id}
                        checked={!!option.state}
                        onChange={() => option.setState(!option.state)}
                    />
                    <label htmlFor={option.id}> {option.label}</label>
                </div>
            ))}
        </div>
    );
}

