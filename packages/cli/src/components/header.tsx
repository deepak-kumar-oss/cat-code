// headerr component for cli


export function Header() {
    return (
        <box justifyContent="center" alignItems="flex-end"> 
            <box flexDirection="row" alignItems="center" gap={0.5} alignItems="center">
                <ascii-font font="tiny" text="CatCode " color="gray" />
                <ascii-font font="tiny" text="CLI" />
            </box>
        </box>
    )
}                                               