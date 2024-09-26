import { Label, Spinner } from "flowbite-react";

const LoadingSpinner = () => {
    return <div style={{ margin: 'auto', minHeight: '50vh', display: 'flex', alignItems: 'center', flexDirection:'column', justifyContent:'center', gap: '.5em' }}>
        <Spinner size='xl'  />
        <Label>Loading...</Label>
    </div>
};

export default LoadingSpinner;