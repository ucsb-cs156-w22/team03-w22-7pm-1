import React, {useState} from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'


function EarthquakesForm({ initialEarthquakes, submitAction, buttonLabel="Retrieve" }) {

    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialEarthquakes || {}, }
    );
    // Stryker enable all
    const navigate = useNavigate();


    return (
 

        <Form onSubmit={handleSubmit(submitAction)}>

            {/* distanceKMKM */}
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="distanceKM">Distance in km from Storke Tower</Form.Label>
                <Form.Control
                    data-testid="EarthquakesForm-distanceKM"
                    id="distanceKM"
                    type="text"
                    isInvalid={Boolean(errors.distanceKM)}
                    {...register("distanceKM", { required: "Distance is required." })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.distanceKM?.message}
                </Form.Control.Feedback>
            </Form.Group>
            {/* minMagnitudenitude */}
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="minMagnitude">Min Magnitude of an earthquake</Form.Label>
                <Form.Control
                    data-testid="EarthquakesForm-minMagnitude"
                    id="minMagnitude"
                    type="text"
                    isInvalid={Boolean(errors.minMagnitude)}
                    {...register("minMagnitude", {
                        required: "min Magnitude is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.minMagnitude?.message}
                </Form.Control.Feedback>
            </Form.Group>



            <Button
                type="retrieve"
                data-testid="EarthquakesForm-retrieve"
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid="EarthquakesForm-cancel"
            >
                Cancel
            </Button>

        </Form>

    )
}

export default EarthquakesForm;
