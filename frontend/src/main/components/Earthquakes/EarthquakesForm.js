import React, {useState} from 'react'
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'


function EarthquakesForm({ initialEarthquakes, SubmitAction, buttonLabel="Retrieve" }) {

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

        <Form onSubmit={handleSubmit(SubmitAction)}>

            {/* distanceKM */}
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="distance">Distance in km from Storke Tower</Form.Label>
                <Form.Control
                    data-testid="EarthquakesForm-distance"
                    id="distanceKM"
                    type="text"
                    isInvalid={Boolean(errors.distanceKm)}
                    {...register("distance", { required: "distance is required." })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.distanceKm?.message}
                </Form.Control.Feedback>
            </Form.Group>
            {/* minMagnitude */}
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="mag">Min Magnitude of an earthquake</Form.Label>
                <Form.Control
                    data-testid="EarthquakesForm-mag"
                    id="minMagnitude"
                    type="text"
                    isInvalid={Boolean(errors.minMagnitude)}
                    {...register("minMagnitude", {
                        required: "mag is required."
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
